# 🤖 Comet Agent Deployment Instructions

**Repository:** https://github.com/AdityaShukla-1411/Hyperverge  
**Target Platform:** Render.com  
**Estimated Time:** 30 minutes

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Before starting, verify these are complete:
- [x] Code pushed to GitHub: https://github.com/AdityaShukla-1411/Hyperverge
- [x] `.gitignore` configured (no node_modules or .env files pushed)
- [x] Backend uses `process.env.PORT`
- [x] Frontend uses `process.env.NEXT_PUBLIC_API_URL`

---

## 🎯 DEPLOYMENT STEPS

### **STEP 1: Get Gemini API Key** (2 minutes)

1. Go to: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the API key (starts with `AIza...`)
4. **Save it securely** - You'll need it in Step 2

---

### **STEP 2: Deploy Backend on Render** (10 minutes)

#### 2.1 Create Render Account
1. Go to: https://render.com/
2. Click **"Get Started for Free"**
3. Sign up with GitHub account (easiest)

#### 2.2 Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Next"**

#### 2.3 Connect GitHub Repository
1. Click **"Connect GitHub"** (if not connected)
2. Find and select repository: **"Hyperverge"**
3. Click **"Connect"**

#### 2.4 Configure Backend Service
Fill in these settings **EXACTLY**:

| Setting | Value |
|---------|-------|
| **Name** | `code-evaluator-backend` |
| **Region** | Select closest to you (e.g., Oregon USA) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

#### 2.5 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add this variable:
```
Key:   GEMINI_API_KEY
Value: [PASTE YOUR API KEY FROM STEP 1]
```

Click **"Add Environment Variable"** again:
```
Key:   PORT
Value: 10000
```

#### 2.6 Deploy Backend
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build to complete
3. You'll see "Live" with a green dot when ready
4. **Copy the backend URL** - It looks like:
   ```
   https://code-evaluator-backend-xxxx.onrender.com
   ```
5. **SAVE THIS URL** - You need it for frontend deployment!

---

### **STEP 3: Deploy Frontend on Render** (10 minutes)

#### 3.1 Create Another Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Select repository: **"Hyperverge"** again
5. Click **"Connect"**

#### 3.2 Configure Frontend Service
Fill in these settings **EXACTLY**:

| Setting | Value |
|---------|-------|
| **Name** | `code-evaluator-frontend` |
| **Region** | Same as backend |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

#### 3.3 Add Frontend Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**

Add this variable (use YOUR backend URL from Step 2.6):
```
Key:   NEXT_PUBLIC_API_URL
Value: https://code-evaluator-backend-xxxx.onrender.com
```

**⚠️ IMPORTANT:** Replace `xxxx` with your actual backend URL!

#### 3.4 Deploy Frontend
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for build to complete
3. You'll see "Live" with a green dot when ready
4. **Copy the frontend URL** - It looks like:
   ```
   https://code-evaluator-frontend-yyyy.onrender.com
   ```

---

### **STEP 4: Test the Deployment** (5 minutes)

#### 4.1 Test Backend Health Check
1. Open browser
2. Go to: `https://code-evaluator-backend-xxxx.onrender.com/health`
3. You should see:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-11-04T..."
   }
   ```

#### 4.2 Test Frontend
1. Open browser
2. Go to: `https://code-evaluator-frontend-yyyy.onrender.com`
3. You should see the Code Evaluator homepage
4. Try uploading a code file (use samples from repo)
5. Check if analysis works

---

## 🔧 TROUBLESHOOTING

### Backend Issues

**Problem:** Build fails with "Module not found"
- **Solution:** Check if `backend/package.json` exists in repo
- Run: `git push origin main` to ensure latest code

**Problem:** Server crashes with "GEMINI_API_KEY is not set"
- **Solution:** Go to Render Dashboard → Backend Service → Environment
- Add variable: `GEMINI_API_KEY = [your-key]`
- Click "Manual Deploy" → "Deploy latest commit"

**Problem:** Backend shows "Application failed to respond"
- **Solution:** Check logs in Render Dashboard
- Verify `PORT` environment variable is set to `10000`
- Verify start command is `node server.js`

### Frontend Issues

**Problem:** Frontend can't connect to backend
- **Solution:** Go to Render Dashboard → Frontend Service → Environment
- Verify `NEXT_PUBLIC_API_URL` is set to YOUR backend URL
- Click "Manual Deploy" → "Deploy latest commit"

**Problem:** Frontend build fails
- **Solution:** Check build logs for errors
- Verify `frontend/package.json` has all dependencies
- Try deploying again (sometimes first deploy fails)

---

## 📋 FINAL VERIFICATION CHECKLIST

After deployment, verify these work:

### Backend Tests
- [ ] Health check responds: `/health`
- [ ] Can upload file via Postman/curl
- [ ] Returns analysis results
- [ ] No errors in Render logs

### Frontend Tests
- [ ] Homepage loads completely
- [ ] Can upload a single file
- [ ] Analysis results display
- [ ] Can download CSV report
- [ ] No console errors (F12 → Console)

### Integration Tests
- [ ] Upload sample file from `samples/sum-of-numbers/`
- [ ] Verify analysis completes in < 30 seconds
- [ ] Check quality score is reasonable (0-100)
- [ ] Verify suggestions are generated

---

## 📝 IMPORTANT URLS TO SAVE

After deployment, save these URLs:

```
Backend Live URL:   https://code-evaluator-backend-xxxx.onrender.com
Frontend Live URL:  https://code-evaluator-frontend-yyyy.onrender.com
GitHub Repository:  https://github.com/AdityaShukla-1411/Hyperverge
Render Dashboard:   https://dashboard.render.com/
```

---

## 🚀 POST-DEPLOYMENT TASKS

### Update GitHub README
1. Go to: https://github.com/AdityaShukla-1411/Hyperverge
2. Edit `README.md`
3. Update the "Live Demo" section with:
   ```markdown
   ## 🌐 Live Demo
   
   **Frontend:** https://code-evaluator-frontend-yyyy.onrender.com
   **Backend API:** https://code-evaluator-backend-xxxx.onrender.com
   ```

### Configure Custom Domain (Optional)
If you want a custom domain like `code-evaluator.com`:
1. Buy domain from Namecheap/GoDaddy
2. In Render Dashboard → Settings → Custom Domains
3. Add your domain
4. Update DNS records as instructed

---

## ⚠️ IMPORTANT NOTES FOR COMET AGENT

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after idle takes ~30 seconds (cold start)
   - 750 hours/month free (enough for 1 service running 24/7)

2. **Environment Variables:**
   - **NEVER** put API keys in code or GitHub
   - Always add them in Render Dashboard → Environment tab
   - Restart service after changing env variables

3. **Redeployment:**
   - To redeploy: `git push origin main`
   - Render auto-deploys when GitHub repo updates
   - Manual deploy: Render Dashboard → "Manual Deploy"

4. **Logs:**
   - Check logs: Render Dashboard → Logs tab
   - Useful for debugging errors
   - Shows console.log() outputs

5. **Scaling:**
   - To upgrade: Render Dashboard → Settings → Instance Type
   - Paid plans start at $7/month
   - Includes no cold starts + more RAM/CPU

---

## 🆘 IF DEPLOYMENT FAILS

### Contact Information
- **GitHub Issues:** https://github.com/AdityaShukla-1411/Hyperverge/issues
- **Render Support:** https://render.com/docs

### Quick Fixes to Try
1. **Clear build cache:** Render Dashboard → Settings → "Clear build cache & redeploy"
2. **Check logs:** Look for red error messages
3. **Verify environment variables:** Must be set before deployment
4. **Test locally first:** Run `npm install && npm start` in both folders
5. **Check GitHub repo:** Ensure all files are pushed

---

## ✅ SUCCESS CRITERIA

Deployment is successful when:
- ✅ Backend URL shows health check JSON
- ✅ Frontend URL loads the homepage
- ✅ Can upload and analyze a code file
- ✅ No errors in browser console (F12)
- ✅ No errors in Render logs
- ✅ Both services show "Live" status on Render

---

## 📊 EXPECTED RESULTS

After successful deployment:

### Backend Response Example
```json
{
  "status": "success",
  "analysis": {
    "quality_score": 85,
    "language": "javascript",
    "suggestions": ["Add error handling", "Use const instead of let"],
    "complexity": "Medium"
  }
}
```

### Frontend Should Show
- File upload interface
- Code analysis results with scores
- Suggestions and improvements
- Download CSV button

---

**GOOD LUCK! 🚀**

*Estimated total time: 30 minutes*  
*Difficulty: Beginner-friendly*  
*Cost: FREE (Render free tier)*
