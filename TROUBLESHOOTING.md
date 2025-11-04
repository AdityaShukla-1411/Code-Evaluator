# 🔧 Troubleshooting Guide

Common issues and their solutions for Code Evaluator Unified.

---

## 🚨 Common Issues

### **1. "Cannot find module" errors**

**Problem:** Missing dependencies

**Solution:**

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

### **2. Backend won't start / API errors**

**Problem:** Missing or invalid Gemini API key

**Solution:**

1. Get a free API key from https://ai.google.dev/
2. Open `backend/.env` file
3. Replace `your_gemini_api_key_here` with your actual key
4. Restart backend server

Example `.env`:

```env
GEMINI_API_KEY=AIzaSyABC123...your-actual-key
```

**Check if API key works:**

```bash
cd backend
npm start
# Should see: 🚀 Code Evaluator Unified Backend running
```

---

### **3. "Port 3000/5000 already in use"**

**Problem:** Port is occupied by another process

**Solution (Windows PowerShell):**

```powershell
# Kill process on port 5000 (backend)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Kill process on port 3000 (frontend)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

**Solution (Windows CMD):**

```cmd
# Find and kill port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Find and kill port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### **4. Frontend shows "Failed to fetch" or "Network Error"**

**Problem:** Backend is not running or CORS issue

**Solutions:**

**A. Check backend is running:**

```bash
# Visit in browser: http://localhost:5000/api/health
# Should return: {"status":"OK",...}
```

**B. Check frontend .env.local:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**C. Restart both servers:**

```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm run dev
```

---

### **5. Build errors / TypeScript errors**

**Problem:** Type errors or build configuration

**Solution:**

```bash
cd frontend

# Clear cache
rm -rf .next node_modules

# Reinstall
npm install

# Try build
npm run build
```

---

### **6. File upload fails**

**Problem:** File size too large or invalid type

**Solutions:**

- Check file is under 10MB
- Ensure file has valid extension (.py, .js, .java, etc.)
- Check backend console for error messages

**Supported file types:**

- Python (.py)
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- Java (.java)
- C++ (.cpp, .cc, .cxx)
- C (.c)
- PHP (.php)
- Ruby (.rb)
- Go (.go)
- And more...

---

### **7. Analysis takes too long / times out**

**Problem:** AI processing delay or API rate limit

**Solutions:**

- Wait 10-30 seconds for AI analysis
- Check your Gemini API quota
- Verify internet connection
- Check backend console for errors

---

### **8. Bulk upload fails**

**Problem:** Too many files or memory issue

**Solutions:**

- Upload max 100 files at a time
- Each file should be under 10MB
- Try smaller batches first (5-10 files)
- Restart backend if memory issues

---

### **9. CSV export doesn't work**

**Problem:** Missing data or browser download blocked

**Solutions:**

- Check browser allows downloads
- Ensure analysis completed successfully
- Try different export format
- Check browser console for errors (F12)

---

### **10. "Module not found" in production**

**Problem:** Build issues or missing dependencies

**Solution:**

```bash
# Backend
cd backend
npm install --production
NODE_ENV=production npm start

# Frontend
cd frontend
npm install
npm run build
npm start
```

---

## 🌐 Deployment Issues

### **Vercel/Netlify Build Fails**

**Solutions:**

- Check Node.js version (20+)
- Verify build command: `npm run build`
- Check output directory: `.next` or `out`
- Add environment variables in dashboard

### **Railway/Render Backend Issues**

**Solutions:**

- Add `GEMINI_API_KEY` in environment variables
- Set `PORT=5000` (or use dynamic port)
- Update `FRONTEND_URL` to production domain
- Check build logs for errors

### **CORS Errors in Production**

**Solution:**
Update backend `.env`:

```env
FRONTEND_URL=https://your-frontend-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

## 🔍 Debugging Tips

### **Check Backend Logs**

```bash
cd backend
npm start
# Watch terminal for errors
```

### **Check Frontend Console**

1. Open browser (F12)
2. Go to Console tab
3. Look for errors (red text)

### **Test API Manually**

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Or in browser
http://localhost:5000/api/health
```

### **Check Network Tab**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try uploading a file
4. Check failed requests

---

## 📊 Performance Issues

### **Slow Analysis**

- Normal: 5-10 seconds per file
- Check internet speed
- Verify Gemini API is responding

### **High Memory Usage**

- Restart servers periodically
- Process fewer files at once
- Clear old reports and uploads

### **Slow Page Load**

- Clear browser cache
- Check frontend build is optimized
- Verify CDN is working (production)

---

## 🆘 Still Having Issues?

### **Get Help:**

1. **Check Documentation:**

   - README.md
   - SETUP.md
   - DEPLOYMENT.md

2. **Check API Key:**

   - Visit https://ai.google.dev/
   - Verify key is active
   - Check usage limits

3. **Check System Requirements:**

   - Node.js 20+ installed
   - npm 10+ installed
   - Sufficient disk space (1GB+)
   - Internet connection active

4. **Fresh Install:**

   ```bash
   # Delete everything except code
   rm -rf node_modules .next uploads reports

   # Reinstall
   cd backend && npm install
   cd frontend && npm install
   ```

5. **Contact Support:**
   - Email: adityashukla1414@gmail.com
   - GitHub Issues: https://github.com/AdityaShukla-1411/code-evaluator-unified/issues

---

## 🎯 Quick Fixes Checklist

Before asking for help, try these:

- [ ] Both servers running (backend & frontend)?
- [ ] Gemini API key configured in `.env`?
- [ ] All dependencies installed (`npm install`)?
- [ ] Ports 3000 and 5000 available?
- [ ] Node.js version 20+ installed?
- [ ] Internet connection working?
- [ ] Browser console checked for errors?
- [ ] Backend logs checked for errors?
- [ ] Tried restarting both servers?
- [ ] Cleared browser cache?

---

**Most issues are solved by:**

1. Adding valid API key to `backend/.env`
2. Restarting both servers
3. Clearing cache and reinstalling dependencies

Good luck! 🚀
