import axios from "axios";
import type {
  AnalysisResult,
  BulkAnalysisResult,
  ReportSummary,
  SavedReport,
  Statistics,
  HealthCheck,
  CSVReportType,
  ApiResponse,
} from "@/types";

// Create axios instance with base configuration
// Prefer same-origin "/api" so Next.js dev proxy (rewrites) handles routing to the backend.
// This avoids CORS and works both on localhost and when accessing via LAN IP.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// Health Check
export const healthCheck = async (): Promise<HealthCheck> => {
  const response = await api.get("/health");
  return response.data;
};

// Single File Analysis
export const analyzeFile = async (
  file: File,
  problemStatement?: string
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append("file", file);
  if (problemStatement) formData.append("problemStatement", problemStatement);

  // Let Axios set the multipart boundary headers automatically
  const response = await api.post("/analyze", formData);

  return response.data;
};

// Direct Code Analysis
export const analyzeCode = async (
  code: string,
  fileName: string = "code.txt",
  problemStatement?: string
): Promise<AnalysisResult> => {
  const response = await api.post("/analyze", {
    code,
    fileName,
    problemStatement,
  });

  return response.data;
};

// Bulk File Analysis
export const analyzeBulkFiles = async (
  files: File[],
  onProgress?: (progress: number) => void,
  problemStatement?: string
): Promise<BulkAnalysisResult> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  if (problemStatement) formData.append("problemStatement", problemStatement);

  // Bypass Next.js proxy for large multipart to avoid dev proxy resets/400s
  const backendURL =
    process.env.NEXT_PUBLIC_API_URL &&
    !process.env.NEXT_PUBLIC_API_URL.startsWith("/")
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
      : "http://localhost:5000";

  const response = await axios.post(
    `${backendURL}/api/analyze/bulk`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    }
  );

  return response.data;
};

// Get Reports List
export const getReports = async (): Promise<ReportSummary[]> => {
  const response = await api.get("/reports");
  return response.data;
};

// Get Specific Report
export const getReport = async (reportId: string): Promise<SavedReport> => {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
};

// Export to CSV
export const exportToCSV = async (
  results: AnalysisResult[],
  reportType: CSVReportType = "detailed"
): Promise<Blob> => {
  const response = await api.post(
    "/export/csv",
    {
      results,
      reportType,
    },
    {
      responseType: "blob",
    }
  );

  return new Blob([response.data], { type: "text/csv" });
};

// Get Statistics
export const getStatistics = async (): Promise<Statistics> => {
  const response = await api.get("/stats");
  return response.data;
};

// File Upload with Progress
export const uploadFileWithProgress = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/analyze", formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });

  return response.data;
};

// Batch Upload with Progress Tracking
export const uploadBatchWithProgress = async (
  files: File[],
  onFileProgress?: (fileName: string, progress: number) => void,
  onOverallProgress?: (progress: number) => void
): Promise<BulkAnalysisResult> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  let uploadedBytes = 0;
  const totalBytes = files.reduce((total, file) => total + file.size, 0);

  const backendURL =
    process.env.NEXT_PUBLIC_API_URL &&
    !process.env.NEXT_PUBLIC_API_URL.startsWith("/")
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
      : "http://localhost:5000";

  const response = await axios.post(
    `${backendURL}/api/analyze/bulk`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onOverallProgress) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onOverallProgress(progress);
        }
      },
    }
  );

  return response.data;
};

// Utility Functions

// Download CSV File
export const downloadCSV = async (
  results: AnalysisResult[],
  reportType: CSVReportType = "detailed",
  fileName?: string
): Promise<void> => {
  try {
    const blob = await exportToCSV(results, reportType);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      fileName || `code_evaluation_${reportType}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw new Error("Failed to download CSV file");
  }
};

// Check if API is Available
export const checkApiStatus = async (): Promise<boolean> => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    console.error("API is not available:", error);
    return false;
  }
};

// Get File Extension
export const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};

// Validate File Type
export const isValidCodeFile = (fileName: string): boolean => {
  const validExtensions = [
    "py",
    "js",
    "ts",
    "jsx",
    "tsx",
    "java",
    "cpp",
    "c",
    "cs",
    "php",
    "rb",
    "go",
    "rs",
    "kt",
    "swift",
    "scala",
    "pl",
    "r",
  ];
  const extension = getFileExtension(fileName);
  return validExtensions.includes(extension);
};

// Format File Size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Validate File Size
export const isValidFileSize = (
  file: File,
  maxSizeMB: number = 10
): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Error Handler
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    if (status === 400) {
      return data.error || "Invalid request. Please check your input.";
    } else if (status === 401) {
      return "Unauthorized access. Please check your credentials.";
    } else if (status === 403) {
      return "Access forbidden. You do not have permission to perform this action.";
    } else if (status === 404) {
      return "Resource not found. Please check the URL or try again.";
    } else if (status === 413) {
      return "File too large. Please use smaller files.";
    } else if (status === 429) {
      return "Too many requests. Please wait and try again.";
    } else if (status >= 500) {
      return "Server error. Please try again later.";
    }

    return data.error || data.message || "An unexpected error occurred.";
  } else if (error.request) {
    // Network error
    return "Network error. Please check your internet connection and try again.";
  } else {
    // Other error
    return error.message || "An unexpected error occurred.";
  }
};

// Create API Error
export const createApiError = (message: string, code?: string): Error => {
  const error = new Error(message);
  (error as any).code = code;
  return error;
};

export default api;
