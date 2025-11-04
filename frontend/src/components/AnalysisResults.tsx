"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Clock,
  Star,
  TrendingUp,
  Shield,
  Code,
  BookOpen,
  Wrench,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AnalysisResult } from "@/types";

interface AnalysisResultsProps {
  results: AnalysisResult[];
  onExportCSV: () => void;
}

export default function AnalysisResults({
  results,
  onExportCSV,
}: AnalysisResultsProps) {
  const getGradeColor = (grade: string) => {
    switch (grade[0]) {
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

  const averageScore =
    results.length > 0
      ? results.reduce((sum, result) => sum + result.score, 0) / results.length
      : 0;

  const averagePlagiarism =
    results.length > 0
      ? results.reduce(
          (sum, result) => sum + (result.plagiarismCheck?.similarity || 0),
          0
        ) / results.length
      : 0;

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No analysis results yet
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Upload and analyze files to see results here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analysis Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {results.length} file{results.length !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <button
          onClick={onExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Average Score
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {averageScore.toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                Files Analyzed
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {results.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Avg Similarity
              </p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {averagePlagiarism.toFixed(1)}%
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <motion.div
            key={
              result.reportId ||
              (result as any).id ||
              `${result.fileName}-${result.timestamp}-${index}`
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Result Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                    <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {result.fileName}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span
                        className={`text-2xl font-bold ${getGradeColor(
                          result.grade
                        )}`}
                      >
                        {result.grade}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {result.score}/100
                      </span>
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(result.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {result.plagiarismCheck && (
                    <>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                          result.plagiarismCheck.riskLevel
                        )}`}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {result.plagiarismCheck.riskLevel} Risk
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {result.plagiarismCheck.similarity}% similarity
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Result Content */}
            <div className="p-6">
              {/* Problem Statement */}
              {result.problemStatement && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Problem Statement
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {result.problemStatement}
                  </p>
                </div>
              )}

              {/* Quick Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Feedback Summary
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {result.feedback.substring(0, 200)}...
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Wrench className="w-4 h-4 mr-2 text-blue-500" />
                    Key Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {result.suggestions.slice(0, 3).map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                      >
                        <span className="text-blue-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plagiarism Details */}
              {result.plagiarismCheck &&
                result.plagiarismCheck.matches &&
                result.plagiarismCheck.matches.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Similarity Matches Found
                    </h4>
                    <div className="space-y-2">
                      {result.plagiarismCheck.matches
                        .slice(0, 3)
                        .map((match, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-orange-700 dark:text-orange-300">
                              {match}
                            </span>
                            <span className="text-orange-600 dark:text-orange-400 font-medium">
                              Similar content found
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Detailed Report */}
              <details className="group">
                <summary className="cursor-pointer flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Detailed Analysis Report
                  </span>
                  <span className="text-gray-500 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>
                      {result.cleanReport || result.feedback}
                    </ReactMarkdown>
                  </div>
                </div>
              </details>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
