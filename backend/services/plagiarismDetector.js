const natural = require("natural");
const diff = require("diff");

/**
 * Detects plagiarism across multiple code files using various algorithms
 * @param {Array} files - Array of file objects with fileName, code, and analysis
 * @returns {Array} Plagiarism results for each file
 */
async function detectPlagiarism(files) {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const currentFile = files[i];
    const plagiarismData = {
      similarity: 0,
      matches: [],
      details: [],
      riskLevel: "Low",
      recommendations: [],
    };

    // Compare with all other files
    for (let j = 0; j < files.length; j++) {
      if (i !== j) {
        const otherFile = files[j];
        const similarity = calculateSimilarity(
          currentFile.code,
          otherFile.code
        );

        if (similarity.overall > 15) {
          // Threshold for reporting
          plagiarismData.matches.push(otherFile.fileName);
          plagiarismData.details.push({
            fileName: otherFile.fileName,
            similarity: similarity.overall,
            details: {
              text: similarity.text,
              structure: similarity.structure,
              tokens: similarity.tokens,
              semantic: similarity.semantic,
            },
            suspiciousBlocks: similarity.suspiciousBlocks,
          });
        }
      }
    }

    // Calculate overall similarity (highest match)
    if (plagiarismData.details.length > 0) {
      plagiarismData.similarity = Math.max(
        ...plagiarismData.details.map((d) => d.similarity)
      );
    }

    // Assess risk level and recommendations
    plagiarismData.riskLevel = assessRiskLevel(plagiarismData.similarity);
    plagiarismData.recommendations = generateRecommendations(
      plagiarismData.similarity,
      plagiarismData.matches.length
    );

    results.push(plagiarismData);
  }

  return results;
}

/**
 * Calculates similarity between two code snippets using multiple algorithms
 * @param {string} code1 - First code snippet
 * @param {string} code2 - Second code snippet
 * @returns {Object} Similarity metrics
 */
function calculateSimilarity(code1, code2) {
  // 1. Text-based similarity (Jaccard similarity)
  const textSimilarity = calculateJaccardSimilarity(code1, code2);

  // 2. Structure-based similarity (normalized diff)
  const structureSimilarity = calculateStructuralSimilarity(code1, code2);

  // 3. Token-based similarity
  const tokenSimilarity = calculateTokenSimilarity(code1, code2);

  // 4. Semantic similarity (using natural language processing)
  const semanticSimilarity = calculateSemanticSimilarity(code1, code2);

  // 5. Find suspicious code blocks
  const suspiciousBlocks = findSuspiciousBlocks(code1, code2);

  // Calculate overall similarity (weighted average)
  const overall = Math.round(
    textSimilarity * 0.25 +
      structureSimilarity * 0.3 +
      tokenSimilarity * 0.3 +
      semanticSimilarity * 0.15
  );

  return {
    overall,
    text: Math.round(textSimilarity),
    structure: Math.round(structureSimilarity),
    tokens: Math.round(tokenSimilarity),
    semantic: Math.round(semanticSimilarity),
    suspiciousBlocks,
  };
}

/**
 * Calculates Jaccard similarity between two texts
 */
function calculateJaccardSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().match(/\w+/g) || []);
  const words2 = new Set(text2.toLowerCase().match(/\w+/g) || []);

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
}

/**
 * Calculates structural similarity using diff analysis
 */
function calculateStructuralSimilarity(code1, code2) {
  // Normalize code structure (remove comments, extra whitespace)
  const normalized1 = normalizeCode(code1);
  const normalized2 = normalizeCode(code2);

  const differences = diff.diffLines(normalized1, normalized2);

  let unchanged = 0;
  let total = 0;

  differences.forEach((part) => {
    const lineCount = part.value.split("\n").length - 1;
    total += lineCount;
    if (!part.added && !part.removed) {
      unchanged += lineCount;
    }
  });

  return total === 0 ? 0 : (unchanged / total) * 100;
}

/**
 * Calculates token-based similarity
 */
function calculateTokenSimilarity(code1, code2) {
  const tokens1 = tokenizeCode(code1);
  const tokens2 = tokenizeCode(code2);

  // Use N-gram analysis
  const ngrams1 = generateNGrams(tokens1, 3);
  const ngrams2 = generateNGrams(tokens2, 3);

  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);

  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
}

/**
 * Calculates semantic similarity using NLP
 */
function calculateSemanticSimilarity(code1, code2) {
  // Extract meaningful identifiers (variable names, function names)
  const identifiers1 = extractIdentifiers(code1);
  const identifiers2 = extractIdentifiers(code2);

  if (identifiers1.length === 0 || identifiers2.length === 0) {
    return 0;
  }

  let totalSimilarity = 0;
  let comparisons = 0;

  identifiers1.forEach((id1) => {
    identifiers2.forEach((id2) => {
      const distance = natural.JaroWinklerDistance(id1, id2);
      totalSimilarity += distance;
      comparisons++;
    });
  });

  return comparisons === 0 ? 0 : (totalSimilarity / comparisons) * 100;
}

/**
 * Finds suspicious code blocks that might indicate copying
 */
function findSuspiciousBlocks(code1, code2) {
  const lines1 = code1.split("\n");
  const lines2 = code2.split("\n");
  const suspiciousBlocks = [];

  // Look for consecutive matching lines (5+ lines)
  for (let i = 0; i < lines1.length - 4; i++) {
    for (let j = 0; j < lines2.length - 4; j++) {
      let consecutiveMatches = 0;
      let k = 0;

      while (
        i + k < lines1.length &&
        j + k < lines2.length &&
        normalizeCodeLine(lines1[i + k]) === normalizeCodeLine(lines2[j + k])
      ) {
        consecutiveMatches++;
        k++;
      }

      if (consecutiveMatches >= 5) {
        suspiciousBlocks.push({
          startLine1: i + 1,
          endLine1: i + consecutiveMatches,
          startLine2: j + 1,
          endLine2: j + consecutiveMatches,
          matchedLines: consecutiveMatches,
        });
      }
    }
  }

  return suspiciousBlocks;
}

/**
 * Utility functions
 */

function normalizeCode(code) {
  return code
    .replace(/\/\/.*$/gm, "") // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/#.*$/gm, "") // Remove Python comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

function normalizeCodeLine(line) {
  return line
    .replace(/\/\/.*$/, "") // Remove comments
    .replace(/#.*$/, "") // Remove Python comments
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

function tokenizeCode(code) {
  // Extract meaningful tokens (keywords, identifiers, operators)
  const tokens = [];
  const tokenPattern =
    /\b(function|class|def|if|else|while|for|return|import|from|const|let|var|public|private|protected)\b|\w+|[+\-*/=<>!&|]+/g;

  let match;
  while ((match = tokenPattern.exec(code)) !== null) {
    tokens.push(match[0].toLowerCase());
  }

  return tokens;
}

function generateNGrams(tokens, n) {
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

function extractIdentifiers(code) {
  // Extract variable names, function names, class names
  const identifiers = [];
  const patterns = [
    /(?:function|def|class)\s+(\w+)/g, // Function/class names
    /(?:const|let|var|=)\s*(\w+)/g, // Variable names
    /(\w+)\s*\(/g, // Function calls
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      if (match[1] && match[1].length > 2) {
        // Ignore very short identifiers
        identifiers.push(match[1].toLowerCase());
      }
    }
  });

  return [...new Set(identifiers)]; // Remove duplicates
}

function assessRiskLevel(similarity) {
  if (similarity >= 80) return "Critical";
  if (similarity >= 60) return "High";
  if (similarity >= 40) return "Medium";
  if (similarity >= 20) return "Low";
  return "Minimal";
}

function generateRecommendations(similarity, matchCount) {
  const recommendations = [];

  if (similarity >= 80) {
    recommendations.push(
      "🚨 Immediate investigation required - extremely high similarity detected"
    );
    recommendations.push("📋 Manual review of code submissions recommended");
    recommendations.push(
      "👥 Consider interviewing students about their approach"
    );
  } else if (similarity >= 60) {
    recommendations.push("⚠️ High similarity detected - review recommended");
    recommendations.push("📝 Check for proper attribution of shared resources");
    recommendations.push("🤝 Verify if collaboration was permitted");
  } else if (similarity >= 40) {
    recommendations.push(
      "💡 Moderate similarity - may indicate common patterns or shared resources"
    );
    recommendations.push(
      "📚 Consider if students used similar tutorials or examples"
    );
  } else if (similarity >= 20) {
    recommendations.push(
      "✅ Low similarity - likely acceptable common practices"
    );
    recommendations.push(
      "📖 May indicate use of standard algorithms or patterns"
    );
  } else {
    recommendations.push("✅ Minimal similarity detected");
    recommendations.push("🎯 Code appears to be original work");
  }

  if (matchCount > 1) {
    recommendations.push(
      `📊 Similar code found in ${matchCount} other submissions`
    );
  }

  return recommendations;
}

/**
 * Generates a detailed plagiarism report
 */
function generatePlagiarismReport(fileName, plagiarismData) {
  const { similarity, riskLevel, matches, details, recommendations } =
    plagiarismData;

  let report = `# 🔍 **PLAGIARISM ANALYSIS REPORT**\n\n`;
  report += `**File:** ${fileName}\n`;
  report += `**Overall Similarity:** ${similarity}%\n`;
  report += `**Risk Level:** ${riskLevel}\n`;
  report += `**Matches Found:** ${matches.length}\n\n`;

  if (details.length > 0) {
    report += `## 📊 **DETAILED SIMILARITY BREAKDOWN**\n\n`;
    details.forEach((detail) => {
      report += `### Match with: ${detail.fileName}\n`;
      report += `- **Overall Similarity:** ${detail.similarity}%\n`;
      report += `- **Text Similarity:** ${detail.details.text}%\n`;
      report += `- **Structural Similarity:** ${detail.details.structure}%\n`;
      report += `- **Token Similarity:** ${detail.details.tokens}%\n`;
      report += `- **Semantic Similarity:** ${detail.details.semantic}%\n\n`;

      if (detail.suspiciousBlocks.length > 0) {
        report += `**Suspicious Code Blocks:**\n`;
        detail.suspiciousBlocks.forEach((block) => {
          report += `- Lines ${block.startLine1}-${block.endLine1} match lines ${block.startLine2}-${block.endLine2} (${block.matchedLines} consecutive lines)\n`;
        });
        report += "\n";
      }
    });
  }

  report += `## 💡 **RECOMMENDATIONS**\n\n`;
  recommendations.forEach((rec) => {
    report += `• ${rec}\n`;
  });

  return report;
}

module.exports = {
  detectPlagiarism,
  calculateSimilarity,
  generatePlagiarismReport,
  assessRiskLevel,
};
