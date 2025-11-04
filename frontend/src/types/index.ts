// Analysis Types
export interface AnalysisResult {
  reportId: string;
  fileName: string;
  score: number;
  grade: string;
  feedback: string;
  suggestions: string[];
  analysis: CodeAnalysis;
  cleanReport?: string;
  problemStatement?: string;
  plagiarismCheck?: PlagiarismResult;
  metadata: AnalysisMetadata;
  timestamp: string;
}

export interface CodeAnalysis {
  language: string;
  totalLines: number;
  codeLength: number;
  complexity: string;
  maintainabilityIndex: number;
}

export interface AnalysisMetadata {
  language: string;
  fileSize: number;
  linesOfCode: number;
}

// Plagiarism Types
export interface PlagiarismResult {
  similarity: number;
  matches: string[];
  details: PlagiarismDetail[];
  riskLevel: PlagiarismRiskLevel;
  recommendations: string[];
}

export interface PlagiarismDetail {
  fileName: string;
  similarity: number;
  details: {
    text: number;
    structure: number;
    tokens: number;
    semantic: number;
  };
  suspiciousBlocks: SuspiciousBlock[];
}

export interface SuspiciousBlock {
  startLine1: number;
  endLine1: number;
  startLine2: number;
  endLine2: number;
  matchedLines: number;
}

export type PlagiarismRiskLevel =
  | "Minimal"
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

// Bulk Analysis Types
export interface BulkAnalysisResult {
  batchId: string;
  results: AnalysisResult[];
  summary: BulkSummary;
}

export interface BulkSummary {
  totalFiles: number;
  averageScore: number;
  plagiarismDetected: number;
  highRiskFiles: number;
}

// Report Types
export interface ReportSummary {
  id: string;
  fileName: string;
  timestamp: string;
  type: "single" | "batch";
}

export interface SavedReport {
  id: string;
  fileName?: string;
  analysis?: AnalysisResult;
  results?: AnalysisResult[];
  summary?: BulkSummary;
  timestamp: string;
}

// File Upload Types
export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "analyzing" | "completed" | "error";
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheck {
  status: string;
  message: string;
  version: string;
  timestamp: string;
  features: {
    aiAnalysis: boolean;
    plagiarismDetection: boolean;
    bulkProcessing: boolean;
    csvExport: boolean;
    cleanReports: boolean;
  };
}

// Statistics Types
export interface Statistics {
  totalReports: number;
  singleAnalysis: number;
  batchAnalysis: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: "single" | "batch";
  timestamp: string;
}

// UI State Types
export interface UploadState {
  files: File[];
  isUploading: boolean;
  progress: FileUploadProgress[];
  results: AnalysisResult[];
  error: string | null;
}

export interface AppState {
  activeTab: "single" | "bulk" | "reports";
  isAnalyzing: boolean;
  results: AnalysisResult[];
  selectedReport: SavedReport | null;
  uploadState: UploadState;
  // Single file upload state
  selectedFile: File | null;
  code: string;
  fileName: string;
  problemStatement?: string;
}

// Grade and Score Types
export type LetterGrade =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F";

export interface ScoreBreakdown {
  codeQuality: number;
  efficiency: number;
  bestPractices: number;
  errorHandling: number;
  documentation: number;
  maintainability: number;
  total: number;
}

// CSV Export Types
export type CSVReportType = "summary" | "detailed" | "plagiarism";

export interface CSVExportOptions {
  reportType: CSVReportType;
  includeHeaders: boolean;
  dateFormat: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
}

// Component Props Types
export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  multiple?: boolean;
  disabled?: boolean;
}

export interface AnalysisResultsProps {
  results: AnalysisResult[];
  onExportCSV?: (results: AnalysisResult[], type: CSVReportType) => void;
  onViewReport?: (reportId: string) => void;
  loading?: boolean;
}

export interface PlagiarismReportProps {
  plagiarismData: PlagiarismResult;
  fileName: string;
  onViewDetails?: (fileName: string) => void;
}

export interface LoadingProps {
  message?: string;
  progress?: number;
  type?: "spinner" | "progress" | "pulse";
}

// Chart Data Types for Analytics
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  score: number;
  count: number;
}
