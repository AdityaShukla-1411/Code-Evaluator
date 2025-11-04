"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Shield,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Award,
  PieChart,
  Activity,
} from "lucide-react";
import { AnalysisResult } from "@/types";

interface StatsOverviewProps {
  results: AnalysisResult[];
}

export default function StatsOverview({ results }: StatsOverviewProps) {
  const stats = React.useMemo(() => {
    if (results.length === 0) {
      return {
        totalFiles: 0,
        averageScore: 0,
        gradeDistribution: {},
        plagiarismStats: {
          average: 0,
          highRisk: 0,
          clean: 0,
        },
        recentActivity: 0,
        topPerformers: [],
        languageStats: {},
      };
    }

    const totalFiles = results.length;
    const averageScore =
      results.reduce((sum, r) => sum + r.score, 0) / totalFiles;

    // Grade distribution
    const gradeDistribution = results.reduce((acc, r) => {
      const grade = r.grade[0];
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Plagiarism statistics
    const avgPlagiarism =
      results.reduce(
        (sum, r) => sum + (r.plagiarismCheck?.similarity || 0),
        0
      ) / totalFiles;
    const highRiskCount = results.filter(
      (r) =>
        r.plagiarismCheck &&
        ["high", "critical"].includes(r.plagiarismCheck.riskLevel.toLowerCase())
    ).length;
    const cleanCount = results.filter(
      (r) =>
        r.plagiarismCheck &&
        r.plagiarismCheck.riskLevel.toLowerCase() === "minimal"
    ).length;

    // Recent activity (last 7 days)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentActivity = results.filter(
      (r) => new Date(r.timestamp).getTime() > weekAgo
    ).length;

    // Top performers
    const topPerformers = [...results]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r) => ({
        id: r.reportId || `${r.fileName}-${r.timestamp}`,
        fileName: r.fileName,
        score: r.score,
        grade: r.grade,
      }));

    // Language statistics
    const languageStats = results.reduce((acc, r) => {
      const ext = r.fileName.split(".").pop()?.toLowerCase() || "unknown";
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles,
      averageScore,
      gradeDistribution,
      plagiarismStats: {
        average: avgPlagiarism,
        highRisk: highRiskCount,
        clean: cleanCount,
      },
      recentActivity,
      topPerformers,
      languageStats,
    };
  }, [results]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-500";
      case "B":
        return "bg-blue-500";
      case "C":
        return "bg-yellow-500";
      case "D":
        return "bg-orange-500";
      case "F":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No data to display
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Analyze some files to see comprehensive statistics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Analytics Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analysis of {stats.totalFiles} submissions
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Total Files
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {stats.totalFiles}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                Average Score
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {stats.averageScore.toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        {/* High Risk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                High Risk
              </p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {stats.plagiarismStats.highRisk}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                This Week
              </p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {stats.recentActivity}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-500" />
            Grade Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${getGradeColor(grade)}`} />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Grade {grade}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {count}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    ({((count / stats.totalFiles) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Language Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Language Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.languageStats)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {lang}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {count}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      ({((count / stats.totalFiles) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Top Performers
        </h3>
        <div className="space-y-3">
          {stats.topPerformers.map((performer, index) => (
            <div
              key={(performer as any).id || `${performer.fileName}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : index === 2
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {performer.fileName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {performer.grade}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({performer.score})
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plagiarism Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800"
      >
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Plagiarism Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {stats.plagiarismStats.average.toFixed(1)}%
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Average Similarity
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {stats.plagiarismStats.highRisk}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              High Risk Files
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {stats.plagiarismStats.clean}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Clean Files
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
