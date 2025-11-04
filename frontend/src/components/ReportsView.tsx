"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Trash2,
  Clock,
  Star,
  Shield,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface Report {
  reportId: string;
  fileName: string;
  score: number;
  grade: string;
  plagiarismCheck: {
    similarity: number;
    riskLevel: string;
  };
  timestamp: string;
}

interface ReportsViewProps {
  reports: Report[];
  onViewReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onExportReports: () => void;
}

export default function ReportsView({
  reports,
  onViewReport,
  onDeleteReport,
  onExportReports,
}: ReportsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "date" | "score" | "name" | "plagiarism"
  >("date");
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);

  useEffect(() => {
    let filtered = reports.filter((report) =>
      report.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterGrade !== "all") {
      filtered = filtered.filter((report) =>
        report.grade.startsWith(filterGrade)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return a.fileName.localeCompare(b.fileName);
        case "plagiarism":
          return b.plagiarismCheck.similarity - a.plagiarismCheck.similarity;
        case "date":
        default:
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
      }
    });

    setFilteredReports(filtered);
  }, [reports, searchTerm, sortBy, filterGrade]);

  const getGradeColor = (grade: string) => {
    switch (grade[0]) {
      case "A":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "B":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      case "C":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "D":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20";
      case "F":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getRiskColor = (riskLevel: string) => {
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
  };

  const stats = {
    total: reports.length,
    averageScore:
      reports.length > 0
        ? reports.reduce((sum, r) => sum + r.score, 0) / reports.length
        : 0,
    highRisk: reports.filter((r) =>
      ["high", "critical"].includes(r.plagiarismCheck.riskLevel.toLowerCase())
    ).length,
    recentReports: reports.filter(
      (r) =>
        new Date(r.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No reports available
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Analyze some files to generate reports
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          If you see filenames without scores, click the eye icon to view full
          details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analysis Reports
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredReports.length} of {reports.length} reports
          </p>
        </div>
        <button
          onClick={onExportReports}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Total Reports
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.total}
              </p>
            </div>
            <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                Avg Score
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.averageScore.toFixed(1)}
              </p>
            </div>
            <Star className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                High Risk
              </p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {stats.highRisk}
              </p>
            </div>
            <Shield className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                This Week
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {stats.recentReports}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Grades</option>
              <option value="A">A Grades</option>
              <option value="B">B Grades</option>
              <option value="C">C Grades</option>
              <option value="D">D Grades</option>
              <option value="F">F Grades</option>
            </select>
            <Filter className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "date" | "score" | "name" | "plagiarism"
                )
              }
              className="appearance-none px-4 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="plagiarism">Sort by Similarity</option>
            </select>
            <Calendar className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report, index) => (
          <motion.div
            key={`${report.reportId}-${report.timestamp}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {report.fileName}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    {report.grade && (
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(
                          report.grade
                        )}`}
                      >
                        {report.grade}
                      </span>
                    )}
                    {typeof report.score === "number" && report.score > 0 && (
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Score: {report.score}/100
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                        report.plagiarismCheck.riskLevel
                      )}`}
                    >
                      {report.plagiarismCheck.riskLevel} Risk
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(report.timestamp).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onViewReport(report.reportId)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="View Report"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteReport(report.reportId)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReports.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No reports found matching &quot;{searchTerm}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
