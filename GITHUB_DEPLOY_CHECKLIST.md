# ✅ GitHub & Deployment Checklist

Use this before pushing to GitHub and deploying to Render.

---

## 📦 Pre-GitHub Push Checklist

### **Files Cleaned** ✅

- [x] Test files removed (`test-*.js`)
- [x] `backend/uploads/` cleaned (only `.gitkeep`)
- [x] `backend/reports/` cleaned (only `.gitkeep`)
- [x] `frontend/.next/` will be excluded by `.gitignore`
- [x] `node_modules/` excluded by `.gitignore`
- [x] `.env` files excluded by `.gitignore`

### **Configuration Ready** ✅

- [x] `.gitignore` configured properly
- [x] `backend/server.js` uses `process.env.PORT`
- [x] Frontend uses `NEXT_PUBLIC_API_URL` env variable
- [x] `.env.example` files present
- [x] No hardcoded secrets in code

### **Documentation Ready** ✅

- [x] README.md updated
- [x] RENDER_DEPLOYMENT.md created
- [x] SETUP.md present
- [x] LICENSE present

---

## 🚀 GitHub Push Steps

```bash
# 1. Initialize git (if needed)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "🚀 Production ready: Clean code for deployment"

# 4. Create new repository on GitHub
# Go to: https://github.com/new
# Name: code-evaluator-unified
# Description: AI-Powered Code Analysis Platform
# Public or Private: Your choice
# Don't initialize with README (we already have one)

# 5. Add remote
git remote add origin https://github.com/YOUR_USERNAME/code-evaluator-unified.git

# 6. Push
git branch -M main
git push -u origin main
```

---

## 🔧 Render Deployment Checklist

### **Backend (Web Service)**

- [ ] Created Web Service on Render
- [ ] Connected GitHub repository
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js`
- [ ] Environment variables added (especially `GEMINI_API_KEY`)
- [ ] Backend URL copied

### **Frontend (Static Site)**

- [ ] Backend URL updated in GitHub (`frontend/.env.local`)
- [ ] Created Static Site on Render
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `.next`
- [ ] Environment variable `NEXT_PUBLIC_API_URL` added
- [ ] Redirects/Rewrites configured (`/*` → `/index.html`)

### **Final Steps**

- [ ] Backend health endpoint works
- [ ] Frontend loads successfully
- [ ] File upload works
- [ ] Analysis works
- [ ] All features tested

---

## 📝 Environment Variables Reference

### **Backend (.env on Render)**

```env
GEMINI_API_KEY=your_actual_api_key
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com
MAX_FILE_SIZE=10485760
MAX_FILES_PER_BATCH=100
SIMILARITY_THRESHOLD=15
HIGH_RISK_THRESHOLD=60
CRITICAL_RISK_THRESHOLD=80
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### **Frontend (.env.local on GitHub & Render)**

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 🎯 Quick Start Commands

### **Local Testing Before Push**

```bash
# Test backend
cd backend
npm install
npm start

# Test frontend (new terminal)
cd frontend
npm install
npm run build
npm start
```

### **After Deployment**

```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Open frontend
https://your-frontend.onrender.com
```

---

## ⚠️ Important Reminders

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Update CORS** after getting frontend URL
3. **Add redirects** for React Router to work
4. **Test thoroughly** before sharing publicly
5. **Monitor** Render dashboard for errors

---

## 🔗 Your URLs

After deployment, fill these in:

```
Backend:  https://__________________________.onrender.com
Frontend: https://__________________________.onrender.com
GitHub:   https://github.com/YOUR_USERNAME/code-evaluator-unified
```

---

**Ready? Let's deploy! 🚀**

Follow: `RENDER_DEPLOYMENT.md` for step-by-step instructions.
