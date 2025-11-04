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
// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ API Response Error: ${error.response?.status} ${error.config?.url}`,
      error.response?.data
    );
    return Promise.reject(error);
  }
);
// Health Check
export const healthCheck = async (): Promise<HealthCheck> => {
  try {
    const response = await api.get<ApiResponse<HealthCheck>>("/health");
    return (response.data.data || response.data) as HealthCheck;
  } catch (error: any) {
    console.error("Health check failed:", error);
    throw new Error(handleApiError(error));
  }
};
// Analyze Code
export const analyzeCode = async (
  code: string,
  language: string = "auto"
): Promise<AnalysisResult> => {
  try {
    console.log("Analyzing code...\nLanguage:", language);
    const response = await api.post<ApiResponse<AnalysisResult>>(
      "/analyze",
      { code, language }
    );
    console.log("Analysis successful");
    return (response.data.data || response.data) as AnalysisResult;
  } catch (error: any) {
    console.error("Analysis error:", error);
    throw new Error(handleApiError(error));
  }
};
// Upload File
export const uploadFile = async (file: File): Promise<AnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    console.log(`Uploading file: ${file.name}`);
    const response = await api.post<ApiResponse<AnalysisResult>>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("File uploaded successfully");
    return (response.data.data || response.data) as AnalysisResult;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(handleApiError(error));
  }
};
// Analyze Bulk Files
export const analyzeBulkFiles = async (
  files: File[],
  onProgress?: (progress: number) => void,
  problemStatement?: string
): Promise<BulkAnalysisResult> => {
  try {
    const uploadResults: any[] = [];
    console.log(`Starting bulk upload of ${files.length} files`);
    // Use uploadBatchWithProgress for the actual upload
    const results = await uploadBatchWithProgress(
      files,
      "https://code-evaluator-backend-7h9w.onrender.com",
      onProgress
    );
    // Trigger bulk analysis
    const response = await api.post<ApiResponse<BulkAnalysisResult>>(
      "/analyze/bulk",
      { files: results, problemStatement }
    );
    return (response.data.data || response.data) as BulkAnalysisResult;
  } catch (error: any) {
    console.error("Bulk analysis error:", error);
    throw new Error(handleApiError(error));
  }
};
// Get All Reports
export const getAllReports = async (): Promise<ReportSummary[]> => {
  try {
    const response = await api.get<ApiResponse<ReportSummary[]>>("/reports");
    return (response.data.data || response.data) as ReportSummary[];
  } catch (error: any) {
    console.error("Failed to fetch reports:", error);
    throw new Error(handleApiError(error));
  }
};
// Get Report by ID
export const getReportById = async (id: string): Promise<SavedReport> => {
  try {
    const response = await api.get<ApiResponse<SavedReport>>(`/reports/${id}`);
    return (response.data.data || response.data) as SavedReport;
  } catch (error: any) {
    console.error(`Failed to fetch report ${id}:`, error);
    throw new Error(handleApiError(error));
  }
};
// Delete Report
export const deleteReport = async (id: string): Promise<void> => {
  try {
    await api.delete(`/reports/${id}`);
    console.log(`Report ${id} deleted successfully`);
  } catch (error: any) {
    console.error(`Failed to delete report ${id}:`, error);
    throw new Error(handleApiError(error));
  }
};
// Get Statistics
export const getStatistics = async (): Promise<Statistics> => {
  try {
    const response = await api.get<ApiResponse<Statistics>>("/statistics");
    return (response.data.data || response.data) as Statistics;
  } catch (error: any) {
    console.error("Failed to fetch statistics:", error);
    throw new Error(handleApiError(error));
  }
};
// Export Report
export const exportReport = async (
  id: string,
  format: CSVReportType = "summary"
): Promise<Blob> => {
  try {
    const response = await api.get(`/export/${id}`, {
      params: { format },
      responseType: "blob",
    });
    console.log(`Report ${id} exported as ${format}`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to export report ${id}:`, error);
    throw new Error(handleApiError(error));
  }
};
// Upload batch with progress tracking
export const uploadBatchWithProgress = async (
  files: File[],
  baseUrl: string = "https://code-evaluator-backend-7h9w.onrender.com",
  onProgress?: (progress: number) => void
): Promise<any[]> => {
  const totalFiles = files.length;
  let completedFiles = 0;
  const results: any[] = [];
  console.log(`Starting batch upload of ${totalFiles} files to ${baseUrl}`);
  for (const file of files) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      results.push({
        filename: file.name,
        success: true,
        data: response.data,
      });
      completedFiles++;
      const progress = Math.round((completedFiles / totalFiles) * 100);
      console.log(
        `Uploaded ${completedFiles}/${totalFiles} files (${progress}%)`
      );
      if (onProgress) {
        onProgress(progress);
      }
    } catch (error: any) {
      console.error(`Failed to upload ${file.name}:`, error);
      results.push({
        filename: file.name,
        success: false,
        error: handleApiError(error),
      });
      completedFiles++;
      const progress = Math.round((completedFiles / totalFiles) * 100);
      if (onProgress) {
        onProgress(progress);
      }
    }
  }
  console.log(`Batch upload completed. ${results.length} files processed.`);
  return results;
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

// Export aliases for backward compatibility
export { healthCheck as checkApiStatus };
export { getAllReports as getReports };
export { getReportById as getReport };
export { uploadFile as analyzeFile };

// Utility function to download CSV files
export function downloadCSV(results: AnalysisResult[], type: CSVReportType): void {
  // Convert results to CSV format based on type
  let csv = '';
  
  if (type === 'summary') {
    // Summary CSV format
    csv = 'Report ID,File Name,Score,Grade,Timestamp\n';
    results.forEach(result => {
      csv += `${result.reportId},${result.fileName},${result.score},${result.grade},${result.timestamp}\n`;
    });
  } else if (type === 'detailed') {
    // Detailed CSV format
    csv = 'Report ID,File Name,Score,Grade,Language,Lines of Code,Complexity,Maintainability Index,Timestamp\n';
    results.forEach(result => {
      csv += `${result.reportId},${result.fileName},${result.score},${result.grade},${result.analysis.language},${result.analysis.totalLines},${result.analysis.complexity},${result.analysis.maintainabilityIndex},${result.timestamp}\n`;
    });
  } else if (type === 'plagiarism') {
    // Plagiarism CSV format
    csv = 'Report ID,File Name,Score,Grade,Plagiarism Similarity,Risk Level,Timestamp\n';
    results.forEach(result => {
      const similarity = result.plagiarismCheck?.similarity || 0;
      const riskLevel = result.plagiarismCheck?.riskLevel || 'N/A';
      csv += `${result.reportId},${result.fileName},${result.score},${result.grade},${similarity},${riskLevel},${result.timestamp}\n`;
    });
  }
  
  const filename = `analysis-${type}-${new Date().toISOString().split('T')[0]}.csv`;
  const csvFile = new Blob([csv], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export default api;
