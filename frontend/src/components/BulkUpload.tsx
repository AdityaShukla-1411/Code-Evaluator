"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Files, X, Folder, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface BulkUploadProps {
  onFilesSelect: (files: File[]) => void;
  selectedFiles: File[];
  isUploading: boolean;
  uploadProgress: number;
}

export default function BulkUpload({
  onFilesSelect,
  selectedFiles,
  isUploading,
  uploadProgress,
}: BulkUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelect(acceptedFiles);
    },
    [onFilesSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "text/javascript": [".js"],
      "text/typescript": [".ts"],
      "text/x-python": [".py"],
      "text/x-java-source": [".java"],
      "text/x-c": [".c"],
      "text/x-c++": [".cpp", ".cc", ".cxx"],
      "text/x-csharp": [".cs"],
      "text/x-php": [".php"],
      "text/x-ruby": [".rb"],
      "text/x-go": [".go"],
      "text/x-rust": [".rs"],
      "text/x-kotlin": [".kt"],
      "text/x-swift": [".swift"],
    },
    multiple: true,
    disabled: isUploading,
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelect(newFiles);
  };

  const clearAllFiles = () => {
    onFilesSelect([]);
  };

  return (
    <div className="space-y-6">
      {/* Bulk Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <Files className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isDragActive
            ? "Drop your files here"
            : "Drag & drop multiple code files"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Upload up to 100 files for batch analysis
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Supports: .py, .js, .ts, .java, .cpp, .c, .cs, .php, .rb, .go, .rs,
          .kt, .swift
        </p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Processing files...
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              disabled={isUploading}
            >
              Clear All
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* File Statistics */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedFiles.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Files
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {(
                    selectedFiles.reduce(
                      (total, file) => total + file.size,
                      0
                    ) /
                    1024 /
                    1024
                  ).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  MB Total
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {
                    new Set(
                      selectedFiles.map((file) => file.name.split(".").pop())
                    ).size
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Languages
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
