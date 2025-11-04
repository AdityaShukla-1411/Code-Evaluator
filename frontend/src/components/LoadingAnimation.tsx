"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Brain,
  Search,
  Shield,
  FileText,
  BarChart3,
} from "lucide-react";

interface LoadingAnimationProps {
  message?: string;
  submessage?: string;
  progress?: number;
  type?: "analysis" | "upload" | "processing" | "plagiarism" | "export";
}

export default function LoadingAnimation({
  message = "Processing...",
  submessage,
  progress,
  type = "analysis",
}: LoadingAnimationProps) {
  const getIcon = () => {
    switch (type) {
      case "analysis":
        return <Brain className="w-8 h-8 text-blue-500" />;
      case "upload":
        return <FileText className="w-8 h-8 text-green-500" />;
      case "processing":
        return <BarChart3 className="w-8 h-8 text-purple-500" />;
      case "plagiarism":
        return <Shield className="w-8 h-8 text-orange-500" />;
      case "export":
        return <Search className="w-8 h-8 text-indigo-500" />;
      default:
        return <Loader2 className="w-8 h-8 text-blue-500" />;
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case "analysis":
        return "from-blue-500 to-purple-500";
      case "upload":
        return "from-green-500 to-blue-500";
      case "processing":
        return "from-purple-500 to-pink-500";
      case "plagiarism":
        return "from-orange-500 to-red-500";
      case "export":
        return "from-indigo-500 to-purple-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Icon */}
      <motion.div
        className="relative mb-6"
        animate={{
          scale: [1, 1.1, 1],
          rotate: type === "analysis" ? [0, 360] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Outer Ring */}
        <motion.div
          className={`absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r ${getGradientColors()} opacity-20`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Middle Ring */}
        <motion.div
          className={`absolute inset-2 w-16 h-16 rounded-full bg-gradient-to-r ${getGradientColors()} opacity-30`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />

        {/* Inner Circle with Icon */}
        <div className="relative w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
          <motion.div
            animate={{
              rotate: type === "processing" ? [0, 360] : 0,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: type === "processing" ? 1 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {getIcon()}
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="w-64 mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${getGradientColors()}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Loading Dots */}
      <div className="flex space-x-1 mb-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${getGradientColors()}`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Message */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {message}
        </h3>
        {submessage && (
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            {submessage}
          </p>
        )}
      </motion.div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${getGradientColors()} opacity-30`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + index,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + index * 10}%`,
              top: `${30 + index * 5}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
