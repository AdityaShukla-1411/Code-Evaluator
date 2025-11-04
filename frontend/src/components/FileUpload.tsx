"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  onCodeChange: (code: string) => void;
  onFileNameChange: (fileName: string) => void;
  selectedFile: File | null;
  code: string;
  fileName: string;
  isUploading: boolean;
}

export default function FileUpload({
  onFileSelect,
  onCodeChange,
  onFileNameChange,
  selectedFile,
  code,
  fileName,
  isUploading,
}: FileUploadProps) {
  const [uploadMode, setUploadMode] = useState<"file" | "code">("file");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
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
    multiple: false,
    disabled: isUploading,
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Mode Toggle */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setUploadMode("file")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadMode === "file"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload File
        </button>
        <button
          onClick={() => setUploadMode("code")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            uploadMode === "code"
              ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          <Code2 className="w-4 h-4 inline mr-2" />
          Paste Code
        </button>
      </div>

      {uploadMode === "file" ? (
        <>
          {/* File Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isDragActive ? "Drop your file here" : "Drag & drop a code file"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports: .py, .js, .ts, .java, .cpp, .c, .cs, .php, .rb, .go,
              .rs, .kt, .swift
            </p>
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <File className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <>
          {/* File Name Input */}
          <div>
            <label
              htmlFor="fileName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              File Name
            </label>
            <input
              type="text"
              id="fileName"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              placeholder="e.g., main.py, script.js, Solution.java"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={isUploading}
            />
          </div>

          {/* Code Input */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Code
            </label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="Paste your code here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
              disabled={isUploading}
            />
          </div>
        </>
      )}
    </div>
  );
}
