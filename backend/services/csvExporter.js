const { stringify } = require("csv-stringify");
const dayjs = require("dayjs");

/**
 * Generates CSV export for analysis results
 * @param {Array} results - Array of analysis results
 * @param {string} reportType - Type of report ('summary', 'detailed', 'plagiarism')
 * @returns {Promise<string>} CSV data as string
 */
async function generateCSV(results, reportType = "detailed") {
  return new Promise((resolve, reject) => {
    try {
      let columns, data;

      switch (reportType) {
        case "summary":
          ({ columns, data } = generateSummaryCSV(results));
          break;
        case "plagiarism":
          ({ columns, data } = generatePlagiarismCSV(results));
          break;
        case "detailed":
        default:
          ({ columns, data } = generateDetailedCSV(results));
          break;
      }

      stringify(
        data,
        {
          header: true,
          columns: columns,
          delimiter: ",",
        },
        (err, csvString) => {
          if (err) {
            reject(err);
          } else {
            resolve(csvString);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generates summary CSV with basic information
 */
function generateSummaryCSV(results) {
  const columns = [
    { key: "studentName", header: "Student Name" },
    { key: "fileName", header: "File Name" },
    { key: "score", header: "Score (0-100)" },
    { key: "grade", header: "Letter Grade" },
    { key: "timestamp", header: "Submission Time" },
    { key: "plagiarismRisk", header: "Plagiarism Risk" },
  ];

  const data = results.map((result) => ({
    studentName: extractStudentName(result.fileName),
    fileName: result.fileName,
    score: result.score || 0,
    grade: result.grade || "N/A",
    timestamp: formatDate(result.timestamp),
    plagiarismRisk: result.plagiarismCheck?.riskLevel || "Not Checked",
  }));

  return { columns, data };
}

/**
 * Generates detailed CSV with comprehensive analysis
 */
function generateDetailedCSV(results) {
  const columns = [
    { key: "studentName", header: "Student Name" },
    { key: "fileName", header: "File Name" },
    { key: "score", header: "Total Score" },
    { key: "grade", header: "Letter Grade" },
    { key: "codeQuality", header: "Code Quality (25)" },
    { key: "efficiency", header: "Efficiency (20)" },
    { key: "bestPractices", header: "Best Practices (20)" },
    { key: "errorHandling", header: "Error Handling (15)" },
    { key: "documentation", header: "Documentation (10)" },
    { key: "maintainability", header: "Maintainability (10)" },
    { key: "language", header: "Language" },
    { key: "linesOfCode", header: "Lines of Code" },
    { key: "feedback", header: "Feedback Summary" },
    { key: "topSuggestion", header: "Top Suggestion" },
    { key: "plagiarismSimilarity", header: "Plagiarism %" },
    { key: "plagiarismRisk", header: "Plagiarism Risk" },
    { key: "timestamp", header: "Analysis Time" },
  ];

  const data = results.map((result) => {
    const analysis = result.analysis || {};
    const plagiarism = result.plagiarismCheck || {};

    return {
      studentName: extractStudentName(result.fileName),
      fileName: result.fileName,
      score: result.score || 0,
      grade: result.grade || "N/A",
      codeQuality: Math.round((result.score || 0) * 0.25),
      efficiency: Math.round((result.score || 0) * 0.2),
      bestPractices: Math.round((result.score || 0) * 0.2),
      errorHandling: Math.round((result.score || 0) * 0.15),
      documentation: Math.round((result.score || 0) * 0.1),
      maintainability: Math.round((result.score || 0) * 0.1),
      language: analysis.language || "Unknown",
      linesOfCode: analysis.totalLines || 0,
      feedback: truncateText(result.feedback || "", 100),
      topSuggestion: result.suggestions?.[0] || "No suggestions",
      plagiarismSimilarity: plagiarism.similarity || 0,
      plagiarismRisk: plagiarism.riskLevel || "Not Checked",
      timestamp: formatDate(result.timestamp),
    };
  });

  return { columns, data };
}

/**
 * Generates plagiarism-focused CSV
 */
function generatePlagiarismCSV(results) {
  const columns = [
    { key: "studentName", header: "Student Name" },
    { key: "fileName", header: "File Name" },
    { key: "score", header: "Code Score" },
    { key: "similarity", header: "Max Similarity %" },
    { key: "riskLevel", header: "Risk Level" },
    { key: "matchCount", header: "Files Matched" },
    { key: "matches", header: "Matching Files" },
    { key: "textSimilarity", header: "Text Similarity %" },
    { key: "structuralSimilarity", header: "Structural Similarity %" },
    { key: "tokenSimilarity", header: "Token Similarity %" },
    { key: "suspiciousBlocks", header: "Suspicious Blocks" },
    { key: "recommendation", header: "Action Recommended" },
    { key: "timestamp", header: "Analysis Time" },
  ];

  const data = results.map((result) => {
    const plagiarism = result.plagiarismCheck || {};
    const details = plagiarism.details || [];
    const highestMatch = details.length > 0 ? details[0] : {};

    return {
      studentName: extractStudentName(result.fileName),
      fileName: result.fileName,
      score: result.score || 0,
      similarity: plagiarism.similarity || 0,
      riskLevel: plagiarism.riskLevel || "Not Checked",
      matchCount: plagiarism.matches?.length || 0,
      matches: plagiarism.matches?.join("; ") || "None",
      textSimilarity: highestMatch.details?.text || 0,
      structuralSimilarity: highestMatch.details?.structure || 0,
      tokenSimilarity: highestMatch.details?.tokens || 0,
      suspiciousBlocks: highestMatch.suspiciousBlocks?.length || 0,
      recommendation: recommendAction(plagiarism.similarity || 0),
      timestamp: formatDate(result.timestamp),
    };
  });

  return { columns, data };
}

/**
 * Extracts student name from filename
 * Handles various naming conventions:
 * - StudentName_Assignment.py
 * - Assignment_StudentName.py
 * - StudentName-Assignment.py
 * - 123456_StudentName.py (ID_Name)
 */
function extractStudentName(fileName) {
  const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension

  // Try different patterns
  const patterns = [
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*?)_/, // Name_Something
    /_([A-Za-z]+(?:\s+[A-Za-z]+)*?)$/, // Something_Name
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*?)-/, // Name-Something
    /-([A-Za-z]+(?:\s+[A-Za-z]+)*?)$/, // Something-Name
    /^\d+_([A-Za-z]+(?:\s+[A-Za-z]+)*?)/, // ID_Name
    /^([A-Za-z]+(?:\s+[A-Za-z]+)*?)$/, // Just the name
  ];

  for (const pattern of patterns) {
    const match = baseName.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/([a-z])([A-Z])/g, "$1 $2"); // Split camelCase
    }
  }

  return baseName; // Fallback to full filename without extension
}

/**
 * Formats date for CSV output
 */
function formatDate(dateString) {
  if (!dateString) return "Unknown";
  return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * Truncates text to specified length
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Converts score to letter grade
 */
function scoreToGrade(score) {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}

/**
 * Calculates overall risk level based on score and plagiarism
 */
function calculateRiskLevel(score, plagiarism) {
  if (plagiarism >= 80 || score < 40) return "Critical";
  if (plagiarism >= 60 || score < 60) return "High";
  if (plagiarism >= 40 || score < 75) return "Medium";
  if (plagiarism >= 20) return "Low";
  return "Minimal";
}

/**
 * Assesses plagiarism risk level
 */
function assessPlagiarismRisk(similarity) {
  if (similarity >= 80) return "Critical";
  if (similarity >= 60) return "High";
  if (similarity >= 40) return "Medium";
  if (similarity >= 20) return "Low";
  return "Minimal";
}

/**
 * Recommends action based on plagiarism similarity
 */
function recommendAction(similarity) {
  if (similarity >= 80) return "Immediate Investigation Required";
  if (similarity >= 60) return "Manual Review Recommended";
  if (similarity >= 40) return "Monitor - Check Context";
  if (similarity >= 20) return "Note - May Be Common Patterns";
  return "No Action Required";
}

/**
 * Generates statistics summary for export
 */
function generateStatsSummary(results) {
  const stats = {
    totalSubmissions: results.length,
    averageScore: 0,
    gradeDistribution: {},
    plagiarismStats: {
      totalChecked: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    },
    languageDistribution: {},
  };

  if (results.length === 0) return stats;

  // Calculate average score
  const totalScore = results.reduce(
    (sum, result) => sum + (result.score || 0),
    0
  );
  stats.averageScore = Math.round(totalScore / results.length);

  // Grade distribution
  results.forEach((result) => {
    const grade = result.grade || scoreToGrade(result.score || 0);
    stats.gradeDistribution[grade] = (stats.gradeDistribution[grade] || 0) + 1;
  });

  // Plagiarism statistics
  results.forEach((result) => {
    if (result.plagiarismCheck) {
      stats.plagiarismStats.totalChecked++;
      const risk = result.plagiarismCheck.riskLevel;
      if (risk === "Critical" || risk === "High") {
        stats.plagiarismStats.highRisk++;
      } else if (risk === "Medium") {
        stats.plagiarismStats.mediumRisk++;
      } else {
        stats.plagiarismStats.lowRisk++;
      }
    }
  });

  // Language distribution
  results.forEach((result) => {
    const language = result.analysis?.language || "Unknown";
    stats.languageDistribution[language] =
      (stats.languageDistribution[language] || 0) + 1;
  });

  return stats;
}

/**
 * Generates a comprehensive analysis report in CSV format
 */
async function generateAnalysisReport(results) {
  const stats = generateStatsSummary(results);

  // Create summary data for CSV
  const summaryData = [
    ["Metric", "Value"],
    ["Total Submissions", stats.totalSubmissions],
    ["Average Score", stats.averageScore],
    ["High Risk Plagiarism", stats.plagiarismStats.highRisk],
    ["Medium Risk Plagiarism", stats.plagiarismStats.mediumRisk],
    ["Low Risk Plagiarism", stats.plagiarismStats.lowRisk],
    ["", ""], // Empty row
    ["Grade Distribution", ""],
    ...Object.entries(stats.gradeDistribution).map(([grade, count]) => [
      grade,
      count,
    ]),
    ["", ""], // Empty row
    ["Language Distribution", ""],
    ...Object.entries(stats.languageDistribution).map(([lang, count]) => [
      lang,
      count,
    ]),
  ];

  return new Promise((resolve, reject) => {
    stringify(summaryData, (err, csvString) => {
      if (err) {
        reject(err);
      } else {
        resolve(csvString);
      }
    });
  });
}

module.exports = {
  generateCSV,
  generateAnalysisReport,
  extractStudentName,
  scoreToGrade,
  assessPlagiarismRisk,
  recommendAction,
  generateStatsSummary,
};
