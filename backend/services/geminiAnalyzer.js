const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

/**
 * Analyzes code using Google Gemini AI with enhanced clean report structure
 * @param {string} code - The code content to analyze
 * @param {string} fileName - The name of the file
 * @returns {Promise<Object>} Analysis results with clean report structure
 */
async function analyzeCode(code, fileName, problemStatement) {
  try {
    const language = detectLanguage(fileName);
    const prompt = buildEnhancedEvaluationPrompt(
      code,
      fileName,
      language,
      problemStatement
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const evaluation = response.text();

    // Parse the response and extract key metrics
    const analysis = parseAnalysisResponse(evaluation, code, language);

    return analysis;
  } catch (error) {
    console.error("Gemini AI analysis error:", error);
    // Fallback to local analysis
    return performLocalAnalysis(code, fileName, problemStatement);
  }
}

/**
 * Builds an enhanced evaluation prompt with clean report structure
 */
function buildEnhancedEvaluationPrompt(
  code,
  fileName,
  language,
  problemStatement
) {
  return `
You are an expert code reviewer and university professor. Analyze the following ${language} code and provide a comprehensive evaluation with a clean, professional report structure.

Evaluate the solution strictly against this problem statement (if provided). If the code doesn't fully address the requirements, call it out explicitly and adjust the scores accordingly.

Problem Statement:
${problemStatement ? problemStatement : "(No problem statement provided)"}

**Code to analyze:**
\`\`\`${language}
${code}
\`\`\`

**File:** ${fileName}

Please provide your analysis in the following EXACT format with clean structure and emoji sections:

# 🔍 **ANALYSIS OVERVIEW**

**Overall Score:** [0-100]/100
**Letter Grade:** [A+, A, A-, B+, B, B-, C+, C, C-, D, F]
**Code Quality Level:** [Excellent/Good/Fair/Poor]

---

# 📊 **DETAILED SCORING BREAKDOWN**

| **Criteria** | **Score** | **Max** | **Percentage** |
|--------------|-----------|---------|----------------|
| Code Quality & Structure | /25 | 25 | % |
| Algorithm Efficiency | /20 | 20 | % |
| Best Practices & Standards | /20 | 20 | % |
| Error Handling & Robustness | /15 | 15 | % |
| Documentation & Comments | /10 | 10 | % |
| Maintainability & Readability | /10 | 10 | % |
| **TOTAL** | **/100** | **100** | **%** |

---

# ✅ **STRENGTHS**

• [List 3-5 specific strengths]
• 
• 

---

# 🔄 **AREAS FOR IMPROVEMENT**

## 🚨 **Critical Issues**
• [List critical issues that need immediate attention]

## ⚠️ **Important Improvements**
• [List important but not critical issues]

## 💡 **Suggestions**
• [List nice-to-have improvements]

---

# 💡 **PRIORITY RECOMMENDATIONS**

## 🔴 **High Priority**
1. [Most important action item]
2. [Second most important]

## 🟡 **Medium Priority**
1. [Important but not urgent]
2. [Another medium priority item]

## 🟢 **Low Priority**
1. [Nice to have improvements]

---

# 📈 **PERFORMANCE & EFFICIENCY ANALYSIS**

**Time Complexity:** [Analysis]
**Space Complexity:** [Analysis]
**Performance Rating:** [Excellent/Good/Fair/Poor]
**Optimization Opportunities:** [List specific optimizations]

---

# 🎯 **FINAL ASSESSMENT**

**Summary:** [2-3 sentence overall assessment]

**Grade Justification:** [Explain why this grade was assigned]

**Next Steps:** [Recommended immediate actions]

---

**🎓 Professor's Note:** [Any additional educational insights or encouragement]

Be specific, constructive, and educational in your feedback. Focus on helping the student improve their coding skills.
`;
}

/**
 * Parses the AI response and extracts structured data
 */
function parseAnalysisResponse(evaluation, code, language) {
  // Extract score using regex
  const scoreMatch =
    evaluation.match(/Overall Score:\*\*\s*(\d+)/i) ||
    evaluation.match(/(\d+)\/100/);
  const score = scoreMatch
    ? parseInt(scoreMatch[1])
    : calculateLocalScore(code, language);

  // Extract grade
  const gradeMatch = evaluation.match(/Letter Grade:\*\*\s*([A-F][+-]?)/i);
  const grade = gradeMatch ? gradeMatch[1] : scoreToGrade(score);

  // Extract suggestions from the recommendations section
  const suggestions = extractSuggestions(evaluation);

  // Extract feedback summary
  const feedback = extractFeedback(evaluation);

  return {
    score: Math.max(0, Math.min(100, score)),
    grade,
    feedback,
    suggestions,
    cleanReport: evaluation,
    analysis: {
      language,
      totalLines: code.split("\n").length,
      codeLength: code.length,
      complexity: assessComplexity(code, language),
      maintainabilityIndex: calculateMaintainabilityIndex(code, language),
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extracts suggestions from the analysis response
 */
function extractSuggestions(evaluation) {
  const suggestions = [];

  // Extract from high priority section
  const highPriorityMatch = evaluation.match(
    /🔴.*?High Priority.*?\n(.*?)(?=##|#|$)/s
  );
  if (highPriorityMatch) {
    const items = highPriorityMatch[1].match(/\d+\.\s*([^\n]+)/g);
    if (items) {
      suggestions.push(
        ...items.map((item) => item.replace(/\d+\.\s*/, "").trim())
      );
    }
  }

  // Extract from critical issues
  const criticalMatch = evaluation.match(
    /🚨.*?Critical Issues.*?\n(.*?)(?=##|#|$)/s
  );
  if (criticalMatch) {
    const items = criticalMatch[1].match(/•\s*([^\n]+)/g);
    if (items) {
      suggestions.push(...items.map((item) => item.replace(/•\s*/, "").trim()));
    }
  }

  return suggestions.slice(0, 5); // Limit to top 5
}

/**
 * Extracts feedback summary from the analysis
 */
function extractFeedback(evaluation) {
  const summaryMatch = evaluation.match(/\*\*Summary:\*\*\s*([^*\n]+)/i);
  if (summaryMatch) {
    return summaryMatch[1].trim();
  }

  // Fallback: extract from final assessment
  const finalMatch = evaluation.match(
    /🎯.*?FINAL ASSESSMENT.*?\n(.*?)(?=\*\*Grade|$)/s
  );
  if (finalMatch) {
    return finalMatch[1].replace(/\*\*/g, "").trim().split("\n")[0];
  }

  return "Code analysis completed with detailed feedback provided in the report.";
}

/**
 * Performs local analysis when AI is not available
 */
function performLocalAnalysis(code, fileName, problemStatement) {
  const language = detectLanguage(fileName);
  const lines = code.split("\n");
  const totalLines = lines.length;
  const commentRatio = calculateCommentRatio(code, language);
  const functionCount = countFunctions(code, language);

  let score = 60; // Base score

  // Scoring logic
  if (commentRatio > 0.1) score += 10;
  if (functionCount > 0) score += 10;
  if (totalLines > 10) score += 5;
  if (code.includes("try") || code.includes("catch") || code.includes("except"))
    score += 10;
  if (!/TODO|FIXME|HACK/i.test(code)) score += 5;

  score = Math.max(0, Math.min(100, score));
  const grade = scoreToGrade(score);

  return {
    score,
    grade,
    feedback: `Local analysis completed for ${fileName}. The code shows ${
      score >= 80 ? "good" : score >= 60 ? "acceptable" : "basic"
    } quality standards.`,
    suggestions: [
      "Add more comprehensive comments",
      "Implement proper error handling",
      "Follow consistent naming conventions",
      "Add input validation",
      "Consider performance optimizations",
    ],
    cleanReport: generateLocalCleanReport(
      score,
      grade,
      language,
      totalLines,
      commentRatio,
      functionCount,
      problemStatement
    ),
    analysis: {
      language,
      totalLines,
      codeLength: code.length,
      complexity: "Medium",
      maintainabilityIndex: Math.round(score * 0.8),
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generates a clean report for local analysis
 */
function generateLocalCleanReport(
  score,
  grade,
  language,
  totalLines,
  commentRatio,
  functionCount,
  problemStatement
) {
  return `# 🔍 **ANALYSIS OVERVIEW**

**Overall Score:** ${score}/100
**Letter Grade:** ${grade}
**Code Quality Level:** ${score >= 80 ? "Good" : score >= 60 ? "Fair" : "Basic"}

---

# 📘 **PROBLEM STATEMENT**

${problemStatement || "(No problem statement provided)"}

---

# 📊 **DETAILED SCORING BREAKDOWN**

| **Criteria** | **Score** | **Max** | **Percentage** |
|--------------|-----------|---------|----------------|
| Code Quality & Structure | ${Math.round(score * 0.25)}/25 | 25 | ${Math.round(
    score * 0.25 * 4
  )}% |
| Algorithm Efficiency | ${Math.round(score * 0.2)}/20 | 20 | ${Math.round(
    score * 0.2 * 5
  )}% |
| Best Practices & Standards | ${Math.round(
    score * 0.2
  )}/20 | 20 | ${Math.round(score * 0.2 * 5)}% |
| Error Handling & Robustness | ${Math.round(
    score * 0.15
  )}/15 | 15 | ${Math.round(score * 0.15 * 6.67)}% |
| Documentation & Comments | ${Math.round(score * 0.1)}/10 | 10 | ${Math.round(
    score * 0.1 * 10
  )}% |
| Maintainability & Readability | ${Math.round(
    score * 0.1
  )}/10 | 10 | ${Math.round(score * 0.1 * 10)}% |
| **TOTAL** | **${score}/100** | **100** | **${score}%** |

---

# ✅ **STRENGTHS**

• Code structure shows basic ${language} syntax understanding
• File contains ${totalLines} lines indicating substantial content
• ${
    functionCount > 0
      ? `Includes ${functionCount} function(s) showing modular thinking`
      : "Basic code organization present"
  }
• ${commentRatio > 0.05 ? "Some documentation present" : "Code is executable"}

---

# 🔄 **AREAS FOR IMPROVEMENT**

## 🚨 **Critical Issues**
• Add comprehensive error handling
• Implement input validation

## ⚠️ **Important Improvements**
• Increase code documentation and comments
• Follow consistent naming conventions
• Add type annotations where applicable

## 💡 **Suggestions**
• Consider performance optimizations
• Add unit tests for better reliability

---

# 💡 **PRIORITY RECOMMENDATIONS**

## 🔴 **High Priority**
1. Implement proper error handling mechanisms
2. Add comprehensive code documentation

## 🟡 **Medium Priority**
1. Follow established ${language} coding standards
2. Add input validation for robustness

## 🟢 **Low Priority**
1. Consider performance optimizations
2. Add type hints or annotations

---

# 📈 **PERFORMANCE & EFFICIENCY ANALYSIS**

**Time Complexity:** Analysis requires deeper code review
**Space Complexity:** Standard for ${language} programs
**Performance Rating:** Fair
**Optimization Opportunities:** Error handling, documentation, validation

---

# 🎯 **FINAL ASSESSMENT**

**Summary:** The code demonstrates basic ${language} programming skills with room for improvement in documentation and error handling.

**Grade Justification:** Score reflects functional code with standard structure but lacking advanced practices.

**Next Steps:** Focus on adding error handling and comprehensive documentation.

---

**🎓 Professor's Note:** Good foundation! Focus on defensive programming practices and thorough documentation for professional-grade code.`;
}

/**
 * Utility functions
 */

function detectLanguage(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();
  const languageMap = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    jsx: "react",
    tsx: "react-typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    kt: "kotlin",
    swift: "swift",
    scala: "scala",
    pl: "perl",
    r: "r",
  };
  return languageMap[extension] || "unknown";
}

function scoreToGrade(score) {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}

function calculateCommentRatio(code, language) {
  const lines = code.split("\n");
  const commentPatterns = {
    python: /^\s*#/,
    javascript: /^\s*(\/\/|\/\*|\*)/,
    typescript: /^\s*(\/\/|\/\*|\*)/,
    java: /^\s*(\/\/|\/\*|\*)/,
    cpp: /^\s*(\/\/|\/\*|\*)/,
    c: /^\s*(\/\/|\/\*|\*)/,
    csharp: /^\s*(\/\/|\/\*|\*)/,
    php: /^\s*(\/\/|\/\*|\*|#)/,
    ruby: /^\s*#/,
    go: /^\s*(\/\/|\/\*|\*)/,
  };

  const pattern = commentPatterns[language];
  if (!pattern) return 0;

  const commentLines = lines.filter((line) => pattern.test(line)).length;
  return commentLines / lines.length;
}

function countFunctions(code, language) {
  const functionPatterns = {
    python: /def\s+\w+\s*\(/g,
    javascript:
      /(function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|\w+\s*:\s*function\s*\()/g,
    typescript:
      /(function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|\w+\s*:\s*function\s*\()/g,
    java: /(public|private|protected)?\s*(static\s+)?\w+\s+\w+\s*\(/g,
    cpp: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    c: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    csharp: /(public|private|protected)?\s*(static\s+)?\w+\s+\w+\s*\(/g,
    php: /function\s+\w+\s*\(/g,
    ruby: /def\s+\w+/g,
    go: /func\s+\w+\s*\(/g,
  };

  const pattern = functionPatterns[language];
  if (!pattern) return 0;

  const matches = code.match(pattern);
  return matches ? matches.length : 0;
}

function calculateLocalScore(code, language) {
  const lines = code.split("\n");
  const totalLines = lines.length;
  const commentRatio = calculateCommentRatio(code, language);
  const functionCount = countFunctions(code, language);

  let score = 60; // Base score

  if (commentRatio > 0.1) score += 10;
  if (functionCount > 0) score += 10;
  if (totalLines > 10) score += 5;
  if (code.includes("try") || code.includes("catch") || code.includes("except"))
    score += 10;
  if (!/TODO|FIXME|HACK/i.test(code)) score += 5;

  return Math.max(0, Math.min(100, score));
}

function assessComplexity(code, language) {
  const cyclomaticIndicators = [
    "if",
    "else",
    "while",
    "for",
    "switch",
    "case",
    "try",
    "catch",
  ];
  let complexity = 1;

  cyclomaticIndicators.forEach((indicator) => {
    const regex = new RegExp(`\\b${indicator}\\b`, "gi");
    const matches = code.match(regex);
    if (matches) complexity += matches.length;
  });

  if (complexity <= 5) return "Low";
  if (complexity <= 10) return "Medium";
  return "High";
}

function calculateMaintainabilityIndex(code, language) {
  const lines = code.split("\n").length;
  const commentRatio = calculateCommentRatio(code, language);
  const functionCount = countFunctions(code, language);

  let maintainability = 100;

  // Penalize long files
  if (lines > 100) maintainability -= 10;
  if (lines > 300) maintainability -= 20;

  // Reward good commenting
  if (commentRatio > 0.1) maintainability += 10;
  if (commentRatio > 0.2) maintainability += 5;

  // Reward modular code
  if (functionCount > 0) maintainability += 5;
  if (functionCount > 3) maintainability += 5;

  return Math.max(0, Math.min(100, maintainability));
}

module.exports = {
  analyzeCode,
  detectLanguage,
  scoreToGrade,
};
