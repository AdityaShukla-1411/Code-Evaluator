# 🚀 Render Deployment Guide

Complete step-by-step guide to deploy Code Evaluator Unified on Render.com (following MERN stack deployment pattern).

---

## 📋 Prerequisites

Before you start:

- ✅ GitHub account
- ✅ Render.com account (free) - Sign up at https://render.com
- ✅ Gemini API key from https://ai.google.dev/

---

## 🎯 Deployment Overview

We'll deploy in 3 steps:

1. **Backend** → Render Web Service
2. **Frontend** → Render Static Site
3. **Connect** → Link frontend to backend

---

## 📦 Step 1: Push to GitHub

### **1.1 Clean Project (Already Done)**

✅ Test files removed
✅ Temporary uploads/reports cleaned
✅ `.gitignore` configured
✅ No sensitive data

### **1.2 Push to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready: Code Evaluator Unified"

# Create new repository on GitHub
# Go to github.com → New Repository → Name it "code-evaluator-unified"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/code-evaluator-unified.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend on Render

### **2.1 Create Web Service**

1. Go to https://dashboard.render.com
2. Click **"New +"** → Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Next"**

### **2.2 Connect GitHub**

1. Click **"Connect GitHub"** (if not connected)
2. Authorize Render to access your repositories
3. Find your repository: **"code-evaluator-unified"**
4. Click **"Connect"**

### **2.3 Configure Backend Service**

Fill in these settings:

| Setting            | Value                                           |
| ------------------ | ----------------------------------------------- |
| **Name**           | `code-evaluator-backend` (or any name you like) |
| **Root Directory** | `backend`                                       |
| **Environment**    | `Node`                                          |
| **Region**         | Choose closest to you                           |
| **Branch**         | `main`                                          |
| **Build Command**  | `npm install`                                   |
| **Start Command**  | `node server.js`                                |
| **Instance Type**  | `Free`                                          |

### **2.4 Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=production
MAX_FILE_SIZE=10485760
MAX_FILES_PER_BATCH=100
SIMILARITY_THRESHOLD=15
HIGH_RISK_THRESHOLD=60
CRITICAL_RISK_THRESHOLD=80
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

**IMPORTANT:** Replace `your_actual_gemini_api_key_here` with your real API key!

Or use **"Add from .env"** button and paste your backend `.env` content.

### **2.5 Deploy Backend**

1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Look for: **"Your service is live"** ✅
4. **Copy the backend URL** (e.g., `https://code-evaluator-backend.onrender.com`)

---

## 🎨 Step 3: Update Frontend with Backend URL

### **3.1 Update on GitHub**

1. Go to your GitHub repository
2. Navigate to: `frontend/.env.local`
3. Click **"Edit"** (pencil icon)
4. Update the file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace `https://your-backend-url.onrender.com` with your actual backend URL from Step 2.5

5. Click **"Commit changes"**
6. Add commit message: "Update backend URL for production"
7. Click **"Commit changes"**

---

## 🌐 Step 4: Deploy Frontend on Render

### **4.1 Create Static Site**

1. Go back to Render Dashboard
2. Click **"New +"** → Select **"Static Site"**
3. Connect same repository: **"code-evaluator-unified"**
4. Click **"Connect"**

### **4.2 Configure Frontend Service**

Fill in these settings:

| Setting               | Value                                   |
| --------------------- | --------------------------------------- |
| **Name**              | `code-evaluator-frontend` (or any name) |
| **Root Directory**    | `frontend`                              |
| **Branch**            | `main`                                  |
| **Build Command**     | `npm install && npm run build`          |
| **Publish Directory** | `out`                                   |

> **📝 Important:** The Publish Directory must be set to `out` (not `.next`). Next.js static export generates files in the `out` directory, which is what Render needs to serve your static site.

### **4.3 Add Environment Variable**

Click **"Advanced"** → **"Add Environment Variable"**

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Use the same backend URL from Step 2.5

### **4.4 Deploy Frontend**

1. Click **"Create Static Site"**
2. Wait for deployment (5-7 minutes)
3. Look for: **"Your site is live"** ✅
4. You'll get a URL like: `https://code-evaluator-frontend.onrender.com`

---

## 🔗 Step 5: Fix React Router (Important!)

Since we're using React Router, we need to add redirects.

### **5.1 Add Redirects to Frontend**

1. In Render Dashboard, open your **Frontend** static site
2. Go to **"Redirects/Rewrites"** tab
3. Click **"Add Rule"**
4. Add this rule:

| Setting         | Value         |
| --------------- | ------------- |
| **Source**      | `/*`          |
| **Destination** | `/index.html` |
| **Action**      | `Rewrite`     |

5. Click **"Save Changes"**

### **5.2 Update Backend CORS (if needed)**

1. Go to your GitHub repository
2. Navigate to: `backend/.env` (or environment variables in Render)
3. Add your frontend URL:

```env
FRONTEND_URL=https://your-frontend-url.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
```

4. In Render Dashboard, go to **Backend Web Service**
5. Go to **"Environment"** tab
6. Add or update these variables
7. Service will automatically redeploy

---

## ✅ Step 6: Test Your Deployment

### **6.1 Test Backend**

Visit: `https://your-backend-url.onrender.com/api/health`

Should return:

```json
{
  "status": "OK",
  "message": "Code Evaluator Unified Backend is running",
  "version": "2.0.0"
}
```

### **6.2 Test Frontend**

1. Visit: `https://your-frontend-url.onrender.com`
2. Upload a code file
3. Test single file analysis
4. Try bulk upload
5. Download CSV report
6. Check all features work

---

## 🎉 You're Done!

Your Code Evaluator Unified is now live on:

- **Backend:** `https://your-backend-url.onrender.com`
- **Frontend:** `https://your-frontend-url.onrender.com`

---

## 🔧 Troubleshooting

### **Issue: Backend shows "Application failed to respond"**

**Solution:**

- Check environment variables are set correctly
- Verify Gemini API key is valid
- Check backend logs in Render dashboard
- Ensure `PORT` is not hardcoded in `server.js`

### **Issue: Frontend shows "Failed to fetch"**

**Solution:**

- Verify backend is running (check health endpoint)
- Confirm `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS configuration in backend
- Look at browser console for errors (F12)

### **Issue: 404 on page refresh**

**Solution:**

- Add redirect/rewrite rule in Render (Step 5.1)
- Source: `/*` → Destination: `/index.html` → Action: `Rewrite`

### **Issue: Build fails**

**Solution:**

- Check Node.js version compatibility
- Verify `package.json` scripts are correct
- Check build logs in Render dashboard
- Try local build: `npm run build`

---

## 📝 Important Notes

### **Free Tier Limitations:**

- ⚠️ Backend may sleep after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds to wake up
- ✅ Static site (frontend) is always fast

### **Keep It Running:**

- Upgrade to paid plan ($7/month) for 24/7 uptime
- Or use external uptime monitor to ping every 10 minutes

### **Custom Domain (Optional):**

1. Go to Settings in Render Dashboard
2. Add custom domain
3. Follow DNS configuration instructions

---

## 🔄 Updating Your App

### **To Deploy Changes:**

```bash
# Make your changes
git add .
git commit -m "Update: your changes"
git push origin main
```

Render will automatically detect the push and redeploy! 🎉

---

## 💰 Cost Breakdown

| Service              | Free Tier            | Paid         |
| -------------------- | -------------------- | ------------ |
| Backend Web Service  | ✅ Free (with sleep) | $7/month     |
| Frontend Static Site | ✅ Always Free       | Free         |
| **Total**            | **$0/month**         | **$7/month** |

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Support:** support@render.com

---

## 🎯 Quick Checklist

Before deploying, ensure:

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Frontend `.env.local` updated with backend URL
- [ ] Frontend deployed on Render
- [ ] Redirects/rewrites configured
- [ ] CORS updated in backend
- [ ] All features tested

---

**🎊 Congratulations! Your app is live on the internet! 🚀**

Share your project:

- Add to portfolio
- Share on LinkedIn
- Add to resume
- Get feedback!

---

**Need Help?**

- Email: adityashukla1414@gmail.com
- GitHub Issues: https://github.com/AdityaShukla-1411/code-evaluator-unified/issues
