import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGradeColor(grade: string): string {
  switch (grade[0]?.toUpperCase()) {
    case "A":
      return "text-green-600 dark:text-green-400";
    case "B":
      return "text-blue-600 dark:text-blue-400";
    case "C":
      return "text-yellow-600 dark:text-yellow-400";
    case "D":
      return "text-orange-600 dark:text-orange-400";
    case "F":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function getPlagiarismRiskColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case "minimal":
      return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
    case "low":
      return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
    case "moderate":
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "high":
      return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400";
    case "critical":
      return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

export function extractStudentName(filename: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

  // Try to extract name patterns like "John_Doe_Assignment1" or "assignment1_john_doe"
  const patterns = [
    /^([A-Za-z]+[_\s][A-Za-z]+)/, // First_Last pattern
    /([A-Za-z]+[_\s][A-Za-z]+)$/, // Last pattern in filename
    /^([A-Za-z]+)/, // Just first name
  ];

  for (const pattern of patterns) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      return match[1]
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
  }

  return "Unknown Student";
}

export function generateReportId(): string {
  return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function downloadFile(
  content: string,
  filename: string,
  contentType: string = "text/plain"
): void {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
