# 🚀 Code Evaluator Unified

<div align="center">

![Code Evaluator Unified](https://img.shields.io/badge/Code_Evaluator-Unified-blue?style=for-the-badge&logo=code-review)

**🎓 Professional AI-Powered Code Analysis Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-orange.svg)](https://ai.google.dev/)

---

## 🚀 Deploy for FREE Now!

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AdityaShukla-1411/Code-Evaluator)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AdityaShukla-1411/Code-Evaluator&project-name=code-evaluator&repository-name=code-evaluator&root-directory=frontend)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AdityaShukla-1411/Code-Evaluator)

**⚡ One-click deployment in 5 minutes!** See [Quick Deploy Guide](./QUICK_DEPLOY.md) for detailed instructions.

---

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-installation) • [Setup Guide](./SETUP.md) • [Deployment](./DEPLOYMENT.md) • [Troubleshooting](./TROUBLESHOOTING.md) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

**Code Evaluator Unified** is a comprehensive, AI-powered code analysis platform that combines the best features from multiple code evaluation tools into a single, clean, and professional solution. Built for educational institutions, it provides detailed code analysis, plagiarism detection, bulk processing, and beautiful reporting.

### ✨ What Makes It Special

- **🤖 AI-Powered Analysis**: Uses Google Gemini 2.0-flash for intelligent code evaluation
- **🎨 Clean Report Structure**: Professional, emoji-organized reports with structured scoring
- **🛡️ Advanced Plagiarism Detection**: Multi-algorithm similarity detection across submissions
- **📦 Bulk Processing**: Analyze hundreds of files simultaneously with progress tracking
- **🌐 Modern UI**: Beautiful, responsive React interface with smooth animations
- **📊 Comprehensive Analytics**: Detailed statistics and exportable CSV reports
- **🔒 Secure & Robust**: Enterprise-grade security with rate limiting and validation

---

## 🎯 Features

### 🚀 **Core Analysis Engine**

- **Google Gemini 2.0 Integration**: State-of-the-art AI for code analysis
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, C#, PHP, Ruby, Go, Rust, Kotlin, Swift, and more
- **Professional Scoring System**: 100-point scale across 6 key criteria
- **Clean Report Generation**: Emoji-organized sections with structured feedback

### 🔍 **Advanced Code Analysis**

| **Criteria**                  | **Weight** | **Analysis Focus**                      |
| ----------------------------- | ---------- | --------------------------------------- |
| Code Quality & Structure      | 25%        | Architecture, organization, readability |
| Algorithm Efficiency          | 20%        | Time/space complexity, optimization     |
| Best Practices & Standards    | 20%        | Coding conventions, patterns            |
| Error Handling & Robustness   | 15%        | Exception handling, edge cases          |
| Documentation & Comments      | 10%        | Code documentation, clarity             |
| Maintainability & Readability | 10%        | Long-term maintenance, clarity          |

### 🛡️ **Plagiarism Detection**

- **Multi-Algorithm Analysis**: Text, structural, token, and semantic similarity
- **Cross-File Comparison**: Automatic comparison across all submissions
- **Risk Assessment**: 5-level risk categorization (Minimal → Critical)
- **Detailed Reports**: Line-by-line similarity analysis with suspicious block detection
- **Actionable Recommendations**: Priority-based improvement suggestions

### 📊 **Bulk Processing & Analytics**

- **Batch Analysis**: Process up to 100 files simultaneously
- **Progress Tracking**: Real-time progress indicators for bulk operations
- **Comprehensive Statistics**: Grade distribution, plagiarism analytics, language breakdown
- **CSV Export**: Multiple export formats (Summary, Detailed, Plagiarism-focused)
- **Student Name Extraction**: Automatic name parsing from filenames

### 🌐 **Modern Web Interface**

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Real-time Updates**: Live progress tracking and status updates
- **Professional Animations**: Smooth transitions and loading states
- **Dark/Light Mode**: Automatic theme adaptation
- **Accessibility**: WCAG 2.1 compliant interface

---

## 🏗️ Architecture

### **Technology Stack**

```
┌─────────────────┬─────────────────┬─────────────────┐
│    Frontend     │     Backend     │   AI Service    │
├─────────────────┼─────────────────┼─────────────────┤
│ Next.js 15      │ Express.js      │ Google Gemini   │
│ React 18        │ Node.js 18+     │ 2.0-flash       │
│ TypeScript 5    │ Multer          │                 │
│ Tailwind CSS    │ Natural NLP     │                 │
│ Framer Motion   │ CSV Processing  │                 │
│ Axios           │ CORS & Helmet   │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

### **Project Structure**

```
code-evaluator-unified/
├── 📁 backend/
│   ├── 📄 server.js                 # Main Express server
│   ├── 📄 package.json              # Backend dependencies
│   ├── 📄 .env                      # Environment configuration
│   ├── 📁 services/
│   │   ├── 📄 geminiAnalyzer.js     # AI analysis engine
│   │   ├── 📄 plagiarismDetector.js # Plagiarism detection
│   │   └── 📄 csvExporter.js        # Data export functionality
│   ├── 📁 uploads/                  # Temporary file storage
│   └── 📁 reports/                  # Analysis results storage
├── 📁 frontend/
│   ├── 📄 package.json              # Frontend dependencies
│   ├── 📄 next.config.js            # Next.js configuration
│   ├── 📄 tailwind.config.js        # Styling configuration
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📄 layout.tsx        # Root layout
│   │   │   ├── 📄 page.tsx          # Main application
│   │   │   └── 📄 globals.css       # Global styles
│   │   ├── 📁 components/           # React components
│   │   ├── 📁 services/             # API integration
│   │   ├── 📁 types/                # TypeScript definitions
│   │   └── 📁 lib/                  # Utility functions
└── 📄 README.md                     # This documentation
```

---

## 🚀 Installation

### **Prerequisites**

- **Node.js** 20.0.0 or higher
- **npm** 10.0.0 or higher
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### **Quick Start**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AdityaShukla-1411/code-evaluator-unified.git
   cd code-evaluator-unified
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Configure environment - IMPORTANT!
   # Edit .env and replace 'your_gemini_api_key_here' with your actual API key
   # Get your free API key from: https://ai.google.dev/

   # Start backend server
   npm start
   ```

3. **Frontend Setup** (in a new terminal)

   ```bash
   cd frontend
   npm install

   # Start development server
   npm run dev
   ```

4. **Open Your Browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

### **Quick Test**

Run the test script to verify everything is working:

```bash
# PowerShell
.\test-app.ps1

# Or open your browser to http://localhost:3000
```

### **Environment Configuration**

**Backend `.env` file** (in `backend/` folder):

```env
# REQUIRED: Get your API key from https://ai.google.dev/
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional (already configured with defaults)
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local` file** (in `frontend/` folder) - Already configured:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 💻 Usage

### **Single File Analysis**

1. **Upload Method**: Drag and drop a code file or click to browse
2. **Direct Input**: Paste code directly into the text area
3. **Analysis**: Click "Analyze Code" and wait for AI processing
4. **Results**: View comprehensive analysis with scoring and suggestions

### **Bulk Processing**

1. **Select Files**: Upload multiple code files (up to 100)
2. **Batch Analysis**: Automatic analysis with plagiarism detection
3. **Progress Tracking**: Real-time progress indicators
4. **Results**: Comprehensive report with cross-file comparisons

### **Report Management**

1. **View Reports**: Access previously generated analysis reports
2. **Export Data**: Download results in CSV format
3. **Analytics**: Review statistics and trends
4. **Search & Filter**: Find specific reports quickly

### **CSV Export Options**

- **Summary**: Basic scores and plagiarism risk
- **Detailed**: Comprehensive analysis breakdown
- **Plagiarism**: Focus on similarity detection results

---

## 🔌 API Documentation

### **Base URL**

```
http://localhost:5000/api
```

### **Endpoints**

#### **Health Check**

```http
GET /health
```

Returns server status and feature availability.

#### **Single File Analysis**

```http
POST /analyze
Content-Type: multipart/form-data

# File upload
file: <code_file>

# OR direct code
{
  "code": "function hello() { return 'world'; }",
  "fileName": "example.js"
}
```

#### **Bulk Analysis**

```http
POST /analyze/bulk
Content-Type: multipart/form-data

files[]: <multiple_code_files>
```

#### **Reports**

```http
GET /reports                    # List all reports
GET /reports/:id               # Get specific report
```

#### **CSV Export**

```http
POST /export/csv
Content-Type: application/json

{
  "results": [...],
  "reportType": "detailed"
}
```

#### **Statistics**

```http
GET /stats
```

### **Response Examples**

**Analysis Result:**

```json
{
  "reportId": "report-1695123456789-123",
  "fileName": "quicksort.py",
  "score": 87,
  "grade": "B+",
  "feedback": "Excellent algorithm implementation with good structure...",
  "suggestions": [
    "Add comprehensive error handling",
    "Include detailed docstrings"
  ],
  "cleanReport": "# 🔍 **ANALYSIS OVERVIEW**\n\n**Overall Score:** 87/100...",
  "plagiarismCheck": {
    "similarity": 12,
    "riskLevel": "Low",
    "matches": []
  },
  "timestamp": "2025-09-22T10:30:00.000Z"
}
```

---

## 📊 Sample Report Structure

Our clean report format provides comprehensive, easy-to-read analysis:

```markdown
# 🔍 **ANALYSIS OVERVIEW**

**Overall Score:** 87/100
**Letter Grade:** B+
**Code Quality Level:** Good

---

# 📊 **DETAILED SCORING BREAKDOWN**

| **Criteria**                  | **Score**  | **Max** | **Percentage** |
| ----------------------------- | ---------- | ------- | -------------- |
| Code Quality & Structure      | 22/25      | 25      | 88%            |
| Algorithm Efficiency          | 17/20      | 20      | 85%            |
| Best Practices & Standards    | 17/20      | 20      | 85%            |
| Error Handling & Robustness   | 12/15      | 15      | 80%            |
| Documentation & Comments      | 9/10       | 10      | 90%            |
| Maintainability & Readability | 9/10       | 10      | 90%            |
| **TOTAL**                     | **87/100** | **100** | **87%**        |

---

# ✅ **STRENGTHS**

• Excellent algorithm implementation with optimal time complexity
• Clean, readable code structure with proper organization
• Good variable naming conventions throughout
• Effective use of Python idioms and best practices

---

# 🔄 **AREAS FOR IMPROVEMENT**

## 🚨 **Critical Issues**

• Add comprehensive error handling for edge cases
• Implement input validation for function parameters

## ⚠️ **Important Improvements**

• Include detailed docstrings for all functions
• Add type hints for better code documentation

## 💡 **Suggestions**

• Consider adding unit tests for reliability
• Add logging for debugging purposes

---

# 💡 **PRIORITY RECOMMENDATIONS**

## 🔴 **High Priority**

1. Implement robust error handling mechanisms
2. Add comprehensive input validation

## 🟡 **Medium Priority**

1. Enhance code documentation with docstrings
2. Add type annotations for clarity

## 🟢 **Low Priority**

1. Consider performance optimizations
2. Add comprehensive unit tests

---

# 📈 **PERFORMANCE & EFFICIENCY ANALYSIS**

**Time Complexity:** O(n log n) - Excellent for sorting algorithm
**Space Complexity:** O(log n) - Efficient recursive implementation
**Performance Rating:** Excellent
**Optimization Opportunities:** Input validation, error handling

---

# 🎯 **FINAL ASSESSMENT**

**Summary:** Excellent algorithm implementation with clean, readable code structure and good performance characteristics.

**Grade Justification:** Strong technical implementation with minor areas for improvement in error handling and documentation.

**Next Steps:** Focus on adding robust error handling and comprehensive documentation.

---

**🎓 Professor's Note:** Outstanding work! The algorithm is well-implemented and demonstrates strong programming fundamentals. Focus on defensive programming practices for production-ready code.
```

---

## 🔧 Configuration

### **Backend Configuration**

All backend settings are configured via environment variables in `.env`:

```env
# Server Settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI Configuration
GEMINI_API_KEY=your_api_key_here

# File Upload Limits
MAX_FILE_SIZE=10485760        # 10MB
MAX_FILES_PER_BATCH=100

# Plagiarism Detection
SIMILARITY_THRESHOLD=15       # Minimum % to report
HIGH_RISK_THRESHOLD=60        # High risk %
CRITICAL_RISK_THRESHOLD=80    # Critical risk %

# Security
RATE_LIMIT_WINDOW=900000      # 15 minutes
RATE_LIMIT_MAX=100            # Max requests per window

# File Storage
REPORTS_DIRECTORY=./reports
UPLOADS_DIRECTORY=./uploads
AUTO_CLEANUP_UPLOADS=true
UPLOAD_RETENTION_HOURS=24
```

### **Frontend Configuration**

Frontend settings in `next.config.js`:

```javascript
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};
```

---

## 🛡️ Security Features

- **Rate Limiting**: Prevents API abuse with configurable limits
- **File Validation**: Strict file type and size validation
- **Input Sanitization**: All inputs are sanitized and validated
- **CORS Protection**: Configurable cross-origin settings
- **Helmet Integration**: Security headers and protection
- **Error Handling**: Graceful error management without information leakage

---

## 📈 Performance Considerations

- **Async Processing**: Non-blocking file analysis
- **Memory Management**: Efficient handling of large file batches
- **File Cleanup**: Automatic temporary file removal
- **Compression**: Response compression for faster transfers
- **Caching**: Results caching for improved performance
- **Progress Tracking**: Real-time progress indicators

---

## 🚀 Deployment

### **⚡ Quick Deploy (FREE)**

**One-click deployment to free hosting platforms:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AdityaShukla-1411/Code-Evaluator)

See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step instructions with all free hosting options!

### **Deployment Options**

Choose the best option for your needs:

- **🌐 Render** - One-click full-stack deployment (Recommended for beginners)
- **⚡ Vercel + Railway** - High performance, generous free tier
- **🔷 Netlify + Render** - Best-in-class hosting combination
- **🐳 Docker** - Self-hosted with complete control

**All options have FREE tiers available!**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

### **Quick Production Build**

1. **Backend Production**

   ```bash
   cd backend
   npm install --production
   NODE_ENV=production npm start
   ```

2. **Frontend Production**

   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

3. **Environment Setup**

   Update your `.env` files with production URLs and API keys.

**Important:** Never commit `.env` files to Git! They contain sensitive API keys.

---

## 🧪 Testing

### **Backend Testing**

```bash
cd backend
npm test

# Run specific tests
npm test -- --grep "plagiarism"
npm test -- --grep "analysis"
```

### **Frontend Testing**

```bash
cd frontend
npm run test

# Run with coverage
npm run test:coverage
```

### **Manual Testing Checklist**

- [ ] Single file analysis works
- [ ] Bulk file processing completes
- [ ] Plagiarism detection identifies similarities
- [ ] CSV export generates correctly
- [ ] Error handling works properly
- [ ] UI is responsive across devices

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Use conventional commit messages
- Ensure accessibility compliance

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aditya Shukla**

- Email: [adityashukla1414@gmail.com](mailto:adityashukla1414@gmail.com)
- GitHub: [@AdityaShukla-1411](https://github.com/AdityaShukla-1411)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful code analysis capabilities
- **React & Next.js** communities for excellent documentation
- **Open Source Community** for inspiration and tools
- **Educational Institutions** for feedback and requirements

---

## 📞 Support

For support, please:

1. Check the [documentation](#-installation)
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting guidance
3. Search [existing issues](https://github.com/AdityaShukla-1411/code-evaluator-unified/issues)
4. Create a [new issue](https://github.com/AdityaShukla-1411/code-evaluator-unified/issues/new)
5. Contact: [adityashukla1414@gmail.com](mailto:adityashukla1414@gmail.com)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Happy Coding!** 🎉

</div>
