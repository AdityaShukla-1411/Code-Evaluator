"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Upload,
  FileText,
  BarChart3,
  Download,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Shield,
  Zap,
  Target,
  Settings,
  Archive,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
// Import components (we'll create these next)
import FileUpload from "@/components/FileUpload";
import BulkUpload from "@/components/BulkUpload";
import AnalysisResults from "@/components/AnalysisResults";
import ReportsView from "@/components/ReportsView";
import LoadingAnimation from "@/components/LoadingAnimation";
import StatsOverview from "@/components/StatsOverview";
// Import services and types
import {
  analyzeFile,
  analyzeCode,
  analyzeBulkFiles,
  downloadCSV,
  checkApiStatus,
  handleApiError,
  getReports,
  getReport,
} from "@/services/api";
import type {
  AnalysisResult,
  BulkAnalysisResult,
  AppState,
  CSVReportType,
} from "@/types";

export default function HomePage() {
  // State management
  const [appState, setAppState] = useState<AppState>({
    activeTab: "single",
    isAnalyzing: false,
    results: [],
    selectedReport: null,
    uploadState: {
      files: [],
      isUploading: false,
      progress: [],
      results: [],
      error: null,
    },
    selectedFile: null,
    code: "",
    fileName: "code.py",
    problemStatement: "",
  });
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );

  // Check API status on component mount
  useEffect(() => {
    const checkApi = async () => {
      const isOnline = await checkApiStatus();
      setApiStatus(isOnline ? "online" : "offline");
      if (!isOnline) {
        toast.error(
          "Backend server is not available. Please start the backend server."
        );
      }
    };
    checkApi();
  }, []);

  // Load saved reports when switching to Reports tab
  useEffect(() => {
    const loadReports = async () => {
      if (appState.activeTab !== "reports") return;
      try {
        const list = await getReports();
        // We only have summaries here; keep them in results as lightweight entries
        // Alternatively, we could store separately—keeping simple for now
        // Fetch details lazily when user clicks view
        // Map summaries into minimal AnalysisResult-like structure for ReportsView display
        const mapped = list.map((r) => ({
          reportId: r.id,
          fileName: r.fileName,
          score: 0,
          grade: "",
          feedback: "",
          suggestions: [],
          analysis: {
            language: "",
            totalLines: 0,
            codeLength: 0,
            complexity: "",
            maintainabilityIndex: 0,
          },
          metadata: { language: "", fileSize: 0, linesOfCode: 0 },
          timestamp: r.timestamp,
        }));
        setAppState((prev) => ({ ...prev, results: mapped }));
      } catch (e) {
        console.error("Failed to load reports:", e);
      }
    };
    loadReports();
  }, [appState.activeTab]);

  // Handle single file analysis
  const handleSingleFileAnalysis = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setAppState((prev) => ({ ...prev, isAnalyzing: true, results: [] }));
    try {
      const result = await analyzeFile(file);
      setAppState((prev) => ({
        ...prev,
        isAnalyzing: false,
        results: [result],
      }));
      toast.success(`Analysis completed for ${file.name}`);
    } catch (error) {
      console.error("Analysis error:", error);
      setAppState((prev) => ({ ...prev, isAnalyzing: false }));
      toast.error(handleApiError(error));
    }
  }, []);

  // Handle direct code analysis
  const handleDirectCodeAnalysis = useCallback(async () => {
    if (!appState.code.trim()) {
      toast.error("Please enter some code to analyze");
      return;
    }
    setAppState((prev) => ({ ...prev, isAnalyzing: true, results: [] }));
    try {
      const result = await analyzeCode(
        appState.code,
        appState.fileName,
        appState.problemStatement
      );
      setAppState((prev) => ({
        ...prev,
        isAnalyzing: false,
        results: [result],
      }));
      toast.success("Code analysis completed");
    } catch (error) {
      console.error("Analysis error:", error);
      setAppState((prev) => ({ ...prev, isAnalyzing: false }));
      toast.error(handleApiError(error));
    }
  }, [appState.code, appState.fileName]);

  // Handle bulk file analysis
  const handleBulkFileAnalysis = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setAppState((prev) => ({
        ...prev,
        isAnalyzing: true,
        results: [],
        uploadState: {
          ...prev.uploadState,
          files,
          isUploading: true,
          progress: files.map((file) => ({
            fileName: file.name,
            progress: 0,
            status: "pending",
          })),
        },
      }));
      try {
        const result = await analyzeBulkFiles(
          files,
          (progress) => {
            setAppState((prev) => ({
              ...prev,
              uploadState: {
                ...prev.uploadState,
                progress: prev.uploadState.progress.map((p) => ({
                  ...p,
                  progress,
                  status: progress === 100 ? "completed" : "uploading",
                })),
              },
            }));
          },
          appState.problemStatement
        );
        setAppState((prev) => ({
          ...prev,
          isAnalyzing: false,
          results: result.results,
          uploadState: {
            ...prev.uploadState,
            isUploading: false,
            results: result.results,
          },
        }));
        toast.success(`Bulk analysis completed for ${files.length} files`);
      } catch (error) {
        console.error("Bulk analysis error:", error);
        setAppState((prev) => ({
          ...prev,
          isAnalyzing: false,
          uploadState: {
            ...prev.uploadState,
            isUploading: false,
            error: handleApiError(error),
          },
        }));
        toast.error(handleApiError(error));
      }
    },
    [appState.problemStatement]
  );

  // Handle CSV export
  const handleExportCSV = useCallback(
    async (results: AnalysisResult[], type: CSVReportType) => {
      try {
        await downloadCSV(results, type);
        toast.success("CSV exported successfully");
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Failed to export CSV");
      }
    },
    []
  );

  // Tab switching
  const setActiveTab = useCallback((tab: "single" | "bulk" | "reports") => {
    setAppState((prev) => ({ ...prev, activeTab: tab, results: [] }));
  }, []);

  return (
    <main className="min-h-screen">
      {/* ... rest of JSX ... */}
    </main>
  );
}
