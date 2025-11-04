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
      const result = await analyzeFile(file, appState.problemStatement);
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
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-b border-white/20 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  Code Evaluator Unified
                </h1>
                <p className="text-sm text-secondary-600">
                  AI-Powered Code Analysis Platform
                </p>
              </div>
            </motion.div>

            {/* API Status Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    apiStatus === "online"
                      ? "bg-success-500"
                      : apiStatus === "offline"
                      ? "bg-danger-500"
                      : "bg-warning-500"
                  }`}
                />
                <span className="text-sm text-secondary-600">
                  {apiStatus === "online"
                    ? "Backend Online"
                    : apiStatus === "offline"
                    ? "Backend Offline"
                    : "Checking..."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Professional Code Analysis
              <span className="block text-3xl md:text-4xl gradient-text">
                with AI-Powered Insights
              </span>
            </h2>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Comprehensive code evaluation with plagiarism detection, bulk
              processing, clean reporting, and detailed analytics designed for
              educational excellence.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              {
                icon: Zap,
                title: "AI-Powered Analysis",
                desc: "Google Gemini 2.0 powered code evaluation with detailed feedback",
              },
              {
                icon: Shield,
                title: "Plagiarism Detection",
                desc: "Advanced similarity checking with multi-algorithm comparison",
              },
              {
                icon: Target,
                title: "Bulk Processing",
                desc: "Analyze hundreds of files simultaneously with comprehensive reports",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card card-hover p-6"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="h-10 w-10 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <motion.div
            className="flex flex-wrap justify-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {[
              { id: "single", label: "Single Analysis", icon: FileText },
              { id: "bulk", label: "Bulk Processing", icon: Users },
              { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 mx-2 mb-2 ${
                  appState.activeTab === tab.id
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-white text-secondary-700 hover:bg-secondary-50 border border-secondary-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={appState.activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {appState.activeTab === "single" && (
                <div className="space-y-8">
                  {/* File Upload Section */}
                  <div className="card p-8">
                    <h3 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
                      Single File Analysis
                    </h3>

                    {/* Problem Statement */}
                    <div className="mb-6 text-left">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Problem Statement / Question (used to evaluate your
                        code)
                      </label>
                      <textarea
                        value={appState.problemStatement || ""}
                        onChange={(e) =>
                          setAppState((prev) => ({
                            ...prev,
                            problemStatement: e.target.value,
                          }))
                        }
                        placeholder="Describe the required behavior, constraints, inputs/outputs, and acceptance criteria."
                        className="w-full min-h-28 p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-secondary-900 dark:text-secondary-100"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-secondary-800 mb-4">
                        Upload Code File
                      </h4>
                      <FileUpload
                        onFileSelect={(file: File | null) => {
                          setAppState((prev) => ({
                            ...prev,
                            selectedFile: file,
                          }));
                          if (file) {
                            handleSingleFileAnalysis([file]);
                          }
                        }}
                        onCodeChange={(code: string) => {
                          setAppState((prev) => ({ ...prev, code }));
                        }}
                        onFileNameChange={(fileName: string) => {
                          setAppState((prev) => ({ ...prev, fileName }));
                        }}
                        selectedFile={appState.selectedFile}
                        code={appState.code}
                        fileName={appState.fileName}
                        isUploading={appState.isAnalyzing}
                      />

                      {/* Analyze Button for direct code */}
                      {appState.code.trim() && (
                        <div className="mt-4">
                          <button
                            onClick={handleDirectCodeAnalysis}
                            disabled={
                              appState.isAnalyzing ||
                              apiStatus !== "online" ||
                              !appState.code.trim()
                            }
                            className="btn-primary w-full"
                          >
                            {appState.isAnalyzing ? (
                              <>
                                <motion.div
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-2" />
                                Analyze Code
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Loading Animation */}
                  {appState.isAnalyzing && (
                    <LoadingAnimation message="Analyzing your code with AI..." />
                  )}

                  {/* Results */}
                  {appState.results.length > 0 && (
                    <AnalysisResults
                      results={appState.results}
                      onExportCSV={() =>
                        handleExportCSV(appState.results, "detailed")
                      }
                    />
                  )}
                </div>
              )}

              {appState.activeTab === "bulk" && (
                <div className="space-y-8">
                  <div className="card p-8">
                    <h3 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
                      Bulk File Processing
                    </h3>
                    {/* Problem Statement */}
                    <div className="mb-6 text-left">
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Problem Statement / Question (applied to all files)
                      </label>
                      <textarea
                        value={appState.problemStatement || ""}
                        onChange={(e) =>
                          setAppState((prev) => ({
                            ...prev,
                            problemStatement: e.target.value,
                          }))
                        }
                        placeholder="Describe the task requirements to evaluate each file against."
                        className="w-full min-h-28 p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-secondary-900 dark:text-secondary-100"
                      />
                    </div>
                    <BulkUpload
                      onFilesSelect={(files: File[]) => {
                        setAppState((prev) => ({
                          ...prev,
                          uploadState: {
                            ...prev.uploadState,
                            files,
                          },
                        }));
                      }}
                      selectedFiles={appState.uploadState.files}
                      isUploading={appState.uploadState.isUploading}
                      uploadProgress={
                        appState.uploadState.progress.length > 0
                          ? appState.uploadState.progress.reduce(
                              (sum, p) => sum + p.progress,
                              0
                            ) / appState.uploadState.progress.length
                          : 0
                      }
                    />

                    {/* Start Bulk Analysis Button */}
                    {appState.uploadState.files.length > 0 && (
                      <div className="mt-6">
                        <button
                          onClick={() =>
                            handleBulkFileAnalysis(appState.uploadState.files)
                          }
                          disabled={
                            appState.isAnalyzing || apiStatus !== "online"
                          }
                          className="btn-primary w-full"
                        >
                          {appState.isAnalyzing ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              Processing {appState.uploadState.files.length}{" "}
                              files...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analyze {appState.uploadState.files.length} Files
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Loading Animation */}
                  {appState.isAnalyzing && (
                    <LoadingAnimation
                      message="Processing bulk files with plagiarism detection..."
                      type="processing"
                    />
                  )}

                  {/* Results */}
                  {appState.results.length > 0 && (
                    <AnalysisResults
                      results={appState.results}
                      onExportCSV={() =>
                        handleExportCSV(appState.results, "detailed")
                      }
                    />
                  )}
                </div>
              )}

              {appState.activeTab === "reports" && (
                <div className="space-y-8">
                  <ReportsView
                    reports={appState.results.map((result) => ({
                      reportId: result.reportId,
                      fileName: result.fileName,
                      score: result.score || 0,
                      grade: result.grade || "",
                      plagiarismCheck: {
                        similarity: result.plagiarismCheck?.similarity || 0,
                        riskLevel:
                          (result.plagiarismCheck?.riskLevel as any) ||
                          "Minimal",
                      },
                      timestamp: result.timestamp,
                    }))}
                    onViewReport={async (reportId: string) => {
                      try {
                        const report = await getReport(reportId);
                        setAppState((prev) => ({
                          ...prev,
                          selectedReport: report,
                        }));
                      } catch (e) {
                        console.error("Failed to load report details:", e);
                      }
                    }}
                    onDeleteReport={(reportId: string) => {
                      setAppState((prev) => ({
                        ...prev,
                        results: prev.results.filter(
                          (r) => r.reportId !== reportId
                        ),
                      }));
                    }}
                    onExportReports={() =>
                      handleExportCSV(appState.results, "summary")
                    }
                  />
                  <StatsOverview results={appState.results} />

                  {/* Report Details Viewer */}
                  {appState.selectedReport && (
                    <div className="card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-secondary-900">
                          Report Details
                        </h3>
                        <button
                          onClick={() =>
                            setAppState((prev) => ({
                              ...prev,
                              selectedReport: null,
                            }))
                          }
                          className="text-secondary-600 hover:text-secondary-900"
                        >
                          Close
                        </button>
                      </div>
                      {(() => {
                        const sr = appState.selectedReport!;
                        let detailResults: AnalysisResult[] = [];

                        if (sr.results && sr.results.length > 0) {
                          // Batch report
                          detailResults = sr.results.map((r: any) => ({
                            ...r,
                            reportId: r.reportId || r.id || sr.id,
                            metadata:
                              r.metadata ||
                              ({
                                language: "",
                                fileSize: 0,
                                linesOfCode: 0,
                              } as any),
                            timestamp: r.timestamp || sr.timestamp,
                          }));
                        } else if (sr.analysis) {
                          // Single report
                          const a: any = sr.analysis;
                          detailResults = [
                            {
                              reportId: a.reportId || sr.id,
                              fileName: sr.fileName || a.fileName || "Unknown",
                              score: a.score || 0,
                              grade: a.grade || "",
                              feedback: a.feedback || "",
                              suggestions: a.suggestions || [],
                              analysis: a.analysis || {
                                language: "",
                                totalLines: 0,
                                codeLength: 0,
                                complexity: "",
                                maintainabilityIndex: 0,
                              },
                              cleanReport: a.cleanReport,
                              problemStatement:
                                a.problemStatement ||
                                (sr as any).problemStatement,
                              plagiarismCheck: a.plagiarismCheck,
                              metadata:
                                a.metadata ||
                                ({
                                  language: "",
                                  fileSize: 0,
                                  linesOfCode: 0,
                                } as any),
                              timestamp: sr.timestamp,
                            },
                          ];
                        }

                        return (
                          <AnalysisResults
                            results={detailResults}
                            onExportCSV={() =>
                              handleExportCSV(detailResults, "detailed")
                            }
                          />
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Code className="h-6 w-6" />
              <span className="font-semibold">Code Evaluator Unified</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-secondary-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Built for Education</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
