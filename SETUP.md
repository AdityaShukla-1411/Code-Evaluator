# ⚡ Quick Setup Guide

Get Code Evaluator Unified running in 5 minutes!

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ **Node.js 20+** installed ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **Google Gemini API Key** ([Get FREE key](https://ai.google.dev/))

---

## 🚀 Installation Steps

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/AdityaShukla-1411/code-evaluator-unified.git
cd code-evaluator-unified
```

### **Step 2: Get Your FREE Gemini API Key**

1. Go to [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API Key" or "Get Started"
3. Sign in with your Google account
4. Create a new API key (it's FREE!)
5. Copy the API key - you'll need it in the next step

### **Step 3: Configure Backend**

```bash
cd backend
npm install
```

**IMPORTANT:** Edit the `.env` file:

1. Open `backend/.env` in any text editor
2. Find the line: `GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual API key
4. Save the file

Example:

```env
GEMINI_API_KEY=AIzaSyABC123...your-actual-key-here
```

### **Step 4: Start Backend Server**

```bash
# Still in the backend folder
npm start
```

You should see:

```
🚀 Code Evaluator Unified Backend running on http://localhost:5000
```

✅ Keep this terminal open!

### **Step 5: Configure Frontend** (New Terminal)

Open a **new terminal window/tab** and run:

```bash
cd code-evaluator-unified/frontend
npm install
```

### **Step 6: Start Frontend**

```bash
# Still in the frontend folder
npm run dev
```

You should see:

```
▲ Next.js 15.x.x
✓ Ready in 2.5s
○ Local: http://localhost:3000
```

### **Step 7: Open in Browser**

Open your browser and go to:

```
http://localhost:3000
```

🎉 **You're all set!**

---

## 🧪 Testing the Application

### **Test 1: Single File Analysis**

1. Go to http://localhost:3000
2. Click "Upload File" tab (should be selected by default)
3. Either:
   - Drag & drop a code file, OR
   - Click to browse and select a code file
4. Click "Analyze Code"
5. Wait 5-10 seconds for AI analysis
6. View your results!

### **Test 2: Bulk Analysis**

1. Click on "Bulk Upload" tab
2. Select multiple code files (2-10 files)
3. Click "Analyze All Files"
4. Watch the progress bar
5. View comprehensive results with plagiarism detection!

### **Test 3: CSV Export**

1. After bulk analysis, scroll down
2. Click "Export CSV"
3. Choose export type (Summary/Detailed/Plagiarism)
4. Download your report!

---

## ❓ Common Issues

### **Issue: "Backend is not running" error**

**Solution:**

1. Make sure you started the backend server (`npm start` in backend folder)
2. Check if port 5000 is not being used by another app
3. Look for any error messages in the backend terminal

### **Issue: "API Key not configured" or analysis fails**

**Solution:**

1. Double-check your API key in `backend/.env`
2. Make sure there are no extra spaces
3. Restart the backend server after editing `.env`

### **Issue: Port already in use**

**Backend (Port 5000):**

```bash
# Windows PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
```

**Frontend (Port 3000):**

```bash
# Windows PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### **Issue: npm install fails**

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Quick Commands Cheat Sheet

### **Start Development**

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run dev
```

### **Production Build**

**Frontend:**

```bash
cd frontend
npm run build
npm start
```

### **Clean Install**

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

---

## 📱 Access from Mobile/Tablet

If you want to test on mobile devices on the same network:

1. Find your computer's IP address:

   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Open on mobile browser:
   ```
   http://YOUR-IP-ADDRESS:3000
   ```

---

## 🔐 Security Note

**⚠️ NEVER commit your `.env` file to GitHub!**

The `.gitignore` file is already configured to exclude:

- `.env` files
- `node_modules/`
- uploaded files
- generated reports

---

## 📚 Next Steps

✅ Installation complete! Now:

1. **Read the [README.md](./README.md)** for full documentation
2. **Check [DEPLOYMENT.md](./DEPLOYMENT.md)** for hosting options
3. **Try the sample files** in the `samples/` folder
4. **Star the repo** ⭐ if you find it useful!

---

## 💬 Need Help?

- 📧 Email: adityashukla1414@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/AdityaShukla-1411/code-evaluator-unified/issues)
- 📖 Full Docs: [README.md](./README.md)

---

**Happy Coding! 🎉**
