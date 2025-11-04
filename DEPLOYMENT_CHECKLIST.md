# 🎯 Deployment Success Checklist

Use this checklist to verify your deployment is working correctly.

---

## ✅ Pre-Deployment

Before deploying, ensure:

- [ ] Code is committed to GitHub
- [ ] You have a Gemini API key from https://ai.google.dev/
- [ ] `.env` files are NOT committed (they should be in `.gitignore`)
- [ ] You've chosen a deployment platform (Render/Vercel/Docker)

---

## 🚀 Deployment Steps

### Option 1: Render (One-Click)

- [ ] Click "Deploy to Render" button
- [ ] Sign in with GitHub
- [ ] Select repository
- [ ] Add `GEMINI_API_KEY` environment variable
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Note backend URL from Render dashboard
- [ ] Note frontend URL from Render dashboard

### Option 2: Vercel + Railway

**Frontend (Vercel):**
- [ ] Click "Deploy with Vercel" button
- [ ] Sign in with GitHub
- [ ] Set root directory to `frontend`
- [ ] Add `NEXT_PUBLIC_API_URL` environment variable (will update later)
- [ ] Deploy frontend

**Backend (Railway):**
- [ ] Install Railway CLI or use web interface
- [ ] Deploy backend service
- [ ] Add `GEMINI_API_KEY` environment variable
- [ ] Add `CORS_ALLOWED_ORIGINS` with Vercel frontend URL
- [ ] Note backend URL

**Link Services:**
- [ ] Update Vercel environment variable `NEXT_PUBLIC_API_URL` with Railway backend URL
- [ ] Redeploy Vercel frontend

### Option 3: Docker

- [ ] Copy `.env.docker.example` to `.env`
- [ ] Add your `GEMINI_API_KEY` to `.env`
- [ ] Run `docker-compose up -d`
- [ ] Wait for services to start (2-3 minutes)

---

## 🧪 Post-Deployment Testing

### Backend Health Check

Test backend is running:

```bash
# Replace with your actual backend URL
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Code Evaluator Unified Backend is running",
  "version": "2.0.0",
  "features": {
    "singleFileAnalysis": true,
    "bulkProcessing": true,
    "plagiarismDetection": true,
    "csvExport": true
  }
}
```

- [ ] Backend health endpoint returns 200 OK
- [ ] Response contains version information
- [ ] All features are listed as available

### Frontend Verification

- [ ] Frontend URL loads successfully
- [ ] No console errors (press F12 to check)
- [ ] Page design looks correct
- [ ] All navigation links work

### Feature Testing

#### Single File Analysis
- [ ] Can upload a code file via drag-and-drop
- [ ] Can paste code directly into text area
- [ ] "Analyze Code" button works
- [ ] Analysis completes without errors
- [ ] Score is displayed (0-100)
- [ ] Grade is shown (A+, A, B+, etc.)
- [ ] Feedback sections are visible
- [ ] Suggestions are provided

#### Bulk Processing
- [ ] Can select multiple files
- [ ] Progress indicator shows during analysis
- [ ] All files are analyzed
- [ ] Plagiarism detection runs
- [ ] Results table displays correctly
- [ ] Can view individual reports

#### CSV Export
- [ ] "Export CSV" button is visible
- [ ] Can select export type (Summary/Detailed/Plagiarism)
- [ ] CSV file downloads successfully
- [ ] CSV contains correct data

#### Reports
- [ ] Can view previously generated reports
- [ ] Reports list displays correctly
- [ ] Can open and view report details
- [ ] Search/filter works (if implemented)

---

## 🔧 Troubleshooting

### Common Issues

#### Backend returns 500 error
- [ ] Check Gemini API key is correct in environment variables
- [ ] Verify API key has proper permissions
- [ ] Check backend logs in dashboard
- [ ] Ensure no extra spaces in environment variables

#### Frontend shows "Failed to fetch"
- [ ] Verify `NEXT_PUBLIC_API_URL` is set correctly
- [ ] Check backend is running (health endpoint)
- [ ] Verify CORS is configured correctly in backend
- [ ] Check browser console for CORS errors (F12)

#### "Invalid API key" error
- [ ] Regenerate API key at https://ai.google.dev/
- [ ] Update environment variable in deployment dashboard
- [ ] Redeploy service

#### File upload fails
- [ ] Check file size (must be under 10MB)
- [ ] Verify file type is supported
- [ ] Check backend logs for errors
- [ ] Ensure `uploads` directory has write permissions (Docker)

#### Plagiarism detection not working
- [ ] Upload at least 2 files for comparison
- [ ] Check files contain actual code (not empty)
- [ ] Verify backend has sufficient memory (upgrade if on free tier)

#### Build fails
- [ ] Check Node.js version (requires 18+)
- [ ] Clear build cache and retry
- [ ] Check build logs for specific errors
- [ ] Verify all dependencies are listed in package.json

---

## 📊 Performance Checks

### Response Times
- [ ] Backend health check responds in < 2 seconds
- [ ] Frontend loads in < 3 seconds
- [ ] Single file analysis completes in < 30 seconds
- [ ] Bulk processing (10 files) completes in < 2 minutes

### Resource Usage
- [ ] Backend memory usage is stable
- [ ] No memory leaks during extended use
- [ ] CPU usage is reasonable
- [ ] Disk space is not filling up

---

## 🔒 Security Verification

- [ ] API key is NOT visible in frontend code
- [ ] Environment variables are secure
- [ ] HTTPS is enabled (should be automatic)
- [ ] CORS is properly configured
- [ ] Rate limiting is working
- [ ] File upload size limits are enforced
- [ ] No sensitive data in error messages

---

## 📈 Optional Enhancements

After basic deployment works:

- [ ] Add custom domain
- [ ] Set up monitoring/alerts
- [ ] Configure uptime monitoring
- [ ] Add analytics
- [ ] Set up automatic backups (for reports)
- [ ] Upgrade to paid tier (if needed)

---

## 🎉 Deployment Complete!

Once all checks pass:

- [ ] Share your deployment URL
- [ ] Add to portfolio/resume
- [ ] Star the repository ⭐
- [ ] Share on social media
- [ ] Consider contributing improvements

---

## 📞 Need Help?

If you encounter issues:

1. **Check Documentation:**
   - [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deployment guide
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive instructions
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues

2. **Check Logs:**
   - Backend logs in hosting dashboard
   - Browser console (F12) for frontend errors
   - Network tab for API call failures

3. **Get Support:**
   - GitHub Issues: https://github.com/AdityaShukla-1411/Code-Evaluator/issues
   - Email: adityashukla1414@gmail.com

---

**Congratulations on deploying Code Evaluator Unified!** 🚀
