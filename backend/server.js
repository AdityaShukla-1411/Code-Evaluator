const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();

// Import services
const geminiAnalyzer = require("./services/geminiAnalyzer");
const plagiarismDetector = require("./services/plagiarismDetector");
const csvExporter = require("./services/csvExporter");

const app = express();
// Use PORT from environment (for Render deployment) or default to 5000
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// CORS configuration
const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS ||
  ["http://localhost:3000", "http://127.0.0.1:3000"].join(",")
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// In development, allow LAN IPs on common dev ports (3000-3002) for convenience
const devOriginRegex =
  /^https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}(?:\.\d{1,3}){3}):(3000|3001|3002)$/;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps / curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (
        process.env.NODE_ENV !== "production" &&
        devOriginRegex.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Ensure preflight requests are handled
app.options("/api/*", cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 100, // Maximum 100 files
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".py",
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".java",
      ".cpp",
      ".cc",
      ".cxx",
      ".c",
      ".cs",
      ".php",
      ".rb",
      ".go",
      ".rs",
      ".kt",
      ".swift",
      ".scala",
      ".pl",
      ".r",
    ];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only code files are allowed."));
    }
  },
});

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Code Evaluator Unified Backend is running",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    features: {
      aiAnalysis: true,
      plagiarismDetection: true,
      bulkProcessing: true,
      csvExport: true,
      cleanReports: true,
    },
  });
});

// Single file analysis
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    let code, fileName;
    const problemStatement = req.body.problemStatement || null;

    if (req.file) {
      // File upload
      const filePath = req.file.path;
      code = await fs.readFile(filePath, "utf-8");
      fileName = req.file.originalname;

      // Clean up uploaded file
      await fs.unlink(filePath);
    } else if (req.body.code) {
      // Direct code input
      code = req.body.code;
      fileName = req.body.fileName || "code.txt";
    } else {
      return res
        .status(400)
        .json({ error: "No file uploaded or code provided" });
    }

    // Analyze the code using Gemini AI
    const analysis = await geminiAnalyzer.analyzeCode(
      code,
      fileName,
      problemStatement
    );

    // Generate unique report ID
    const reportId = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save report
    const reportData = {
      id: reportId,
      fileName,
      analysis,
      timestamp: new Date().toISOString(),
      problemStatement: problemStatement,
      metadata: {
        language: geminiAnalyzer.detectLanguage(fileName),
        fileSize: code.length,
        linesOfCode: code.split("\n").length,
      },
    };

    await fs.writeFile(
      `reports/${reportId}.json`,
      JSON.stringify(reportData, null, 2)
    );

    res.json({
      reportId,
      fileName,
      score: analysis.score,
      grade: analysis.grade,
      feedback: analysis.feedback,
      suggestions: analysis.suggestions,
      analysis: analysis.analysis,
      cleanReport: analysis.cleanReport,
      problemStatement: problemStatement,
      metadata: reportData.metadata,
      timestamp: reportData.timestamp,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze code",
      details: error.message,
    });
  }
});

// Bulk file analysis with plagiarism detection
app.post("/api/analyze/bulk", upload.array("files", 100), async (req, res) => {
  try {
    const problemStatement = req.body.problemStatement || null;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];
    const fileContents = [];

    // Process each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const filePath = file.path;
      const code = await fs.readFile(filePath, "utf-8");

      // Analyze code
      const analysis = await geminiAnalyzer.analyzeCode(
        code,
        file.originalname,
        problemStatement
      );

      // Store for plagiarism detection
      fileContents.push({
        fileName: file.originalname,
        code,
        analysis,
      });

      // Clean up uploaded file
      await fs.unlink(filePath);
    }

    // Perform plagiarism detection across all files (with safe fallback)
    let plagiarismResults = [];
    try {
      plagiarismResults = await plagiarismDetector.detectPlagiarism(
        fileContents
      );
    } catch (e) {
      console.error("Plagiarism detection failed, defaulting to minimal:", e);
      plagiarismResults = fileContents.map(() => ({
        similarity: 0,
        matches: [],
        details: [],
        riskLevel: "Minimal",
        recommendations: [],
      }));
    }

    // Generate results with plagiarism data
    for (let i = 0; i < fileContents.length; i++) {
      const file = fileContents[i];
      const reportId = `bulk_${Date.now()}_${i}`;

      const result = {
        id: reportId,
        fileName: file.fileName,
        score: file.analysis.score,
        grade: file.analysis.grade,
        feedback: file.analysis.feedback,
        suggestions: file.analysis.suggestions,
        analysis: file.analysis.analysis,
        problemStatement: problemStatement,
        plagiarismCheck: plagiarismResults[i] || {
          similarity: 0,
          matches: [],
          details: [],
          riskLevel: "Minimal",
          recommendations: [],
        },
        timestamp: new Date().toISOString(),
      };

      results.push(result);

      // Save individual report
      await fs.writeFile(
        `reports/${reportId}.json`,
        JSON.stringify(result, null, 2)
      );
    }

    // Save batch report
    const batchReportId = `batch_${Date.now()}`;
    const batchReport = {
      id: batchReportId,
      results,
      summary: {
        totalFiles: results.length,
        averageScore:
          results.reduce((sum, r) => sum + r.score, 0) / results.length,
        plagiarismDetected: results.filter(
          (r) => (r.plagiarismCheck?.similarity || 0) > 30
        ).length,
        highRiskFiles: results.filter(
          (r) => (r.plagiarismCheck?.similarity || 0) > 70
        ).length,
      },
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(
      `reports/${batchReportId}.json`,
      JSON.stringify(batchReport, null, 2)
    );

    res.json({
      batchId: batchReportId,
      results,
      summary: batchReport.summary,
    });
  } catch (error) {
    console.error("Bulk analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze files",
      details: error.message,
    });
  }
});

// Get saved reports
app.get("/api/reports", async (req, res) => {
  try {
    const files = await fs.readdir("reports/");
    const reports = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const reportData = await fs.readFile(`reports/${file}`, "utf-8");
        const report = JSON.parse(reportData);
        reports.push({
          id: report.id,
          fileName: report.fileName || "Batch Analysis",
          timestamp: report.timestamp,
          type: report.results ? "batch" : "single",
        });
      }
    }

    // Sort by timestamp (newest first)
    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Get specific report
app.get("/api/reports/:id", async (req, res) => {
  try {
    const reportPath = `reports/${req.params.id}.json`;
    const reportData = await fs.readFile(reportPath, "utf-8");
    const report = JSON.parse(reportData);
    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(404).json({ error: "Report not found" });
  }
});

// CSV Export
app.post("/api/export/csv", async (req, res) => {
  try {
    const { results, reportType = "detailed" } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: "Invalid results data" });
    }

    const csvData = await csvExporter.generateCSV(results, reportType);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=code_evaluation_${Date.now()}.csv`
    );
    res.send(csvData);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({
      error: "Failed to generate CSV",
      details: error.message,
    });
  }
});

// Statistics endpoint
app.get("/api/stats", async (req, res) => {
  try {
    const files = await fs.readdir("reports/");
    const stats = {
      totalReports: files.length,
      singleAnalysis: 0,
      batchAnalysis: 0,
      recentActivity: [],
    };

    // Calculate statistics
    for (const file of files.slice(0, 10)) {
      // Last 10 reports
      if (file.endsWith(".json")) {
        const reportData = await fs.readFile(`reports/${file}`, "utf-8");
        const report = JSON.parse(reportData);

        if (report.results) {
          stats.batchAnalysis++;
        } else {
          stats.singleAnalysis++;
        }

        stats.recentActivity.push({
          id: report.id,
          type: report.results ? "batch" : "single",
          timestamp: report.timestamp,
        });
      }
    }

    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 10MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ error: "Too many files. Maximum is 100 files." });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server (bind to 0.0.0.0 to allow LAN access)
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Code Evaluator Unified Backend running on http://localhost:${PORT}`
  );
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`📦 Bulk endpoint: http://localhost:${PORT}/api/analyze/bulk`);
  console.log(`📈 Reports: http://localhost:${PORT}/api/reports`);
});

module.exports = app;
