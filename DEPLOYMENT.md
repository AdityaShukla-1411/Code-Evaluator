# 🚀 Deployment Guide

Complete guide for deploying Code Evaluator Unified to production.

## 📋 Pre-Deployment Checklist

- [ ] Get a Google Gemini API Key from [https://ai.google.dev/](https://ai.google.dev/)
- [ ] Choose your hosting platform (Vercel, Netlify, Railway, etc.)
- [ ] Prepare environment variables
- [ ] Test locally first

---

## 🌐 Hosting Options

### **Option 1: Vercel (Recommended for Frontend) + Railway (Backend)**

#### **Backend Deployment on Railway**

1. **Create Railway Account**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**

   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login
   railway login

   # Navigate to backend
   cd backend

   # Initialize and deploy
   railway init
   railway up
   ```

3. **Set Environment Variables in Railway Dashboard**

   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-domain.vercel.app
   ```

4. **Note Your Backend URL** (e.g., `https://your-backend.railway.app`)

#### **Frontend Deployment on Vercel**

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     ```
   - Deploy!

---

### **Option 2: Render (Full Stack)**

1. **Backend Service**

   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables

2. **Frontend Service**
   - Create new Static Site
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `out`
   - Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
   
   > **📝 Note:** The Publish Directory must be `out` because Next.js static export generates files in this directory.

---

### **Option 3: Docker Deployment**

1. **Create Backend Dockerfile**

   ```dockerfile
   # backend/Dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Create Frontend Dockerfile**

   ```dockerfile
   # frontend/Dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:20-alpine
   WORKDIR /app
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

3. **Create docker-compose.yml**

   ```yaml
   version: "3.8"
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - NODE_ENV=production
       volumes:
         - ./backend/reports:/app/reports
         - ./backend/uploads:/app/uploads

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://backend:5000
       depends_on:
         - backend
   ```

4. **Deploy**
   ```bash
   docker-compose up -d
   ```

---

## 🔐 Environment Variables

### **Backend (.env)**

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_FILES_PER_BATCH=100

# Plagiarism Detection
SIMILARITY_THRESHOLD=15
HIGH_RISK_THRESHOLD=60
CRITICAL_RISK_THRESHOLD=80

# Security
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Storage
REPORTS_DIRECTORY=./reports
UPLOADS_DIRECTORY=./uploads
AUTO_CLEANUP_UPLOADS=true
UPLOAD_RETENTION_HOURS=24
```

### **Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## 🧪 Testing Before Deployment

### **Local Production Test**

1. **Build and Test Backend**

   ```bash
   cd backend
   npm install
   NODE_ENV=production npm start
   ```

2. **Test Backend Health**

   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Build and Test Frontend**

   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

4. **Visit** `http://localhost:3000`

---

## 📊 Post-Deployment Verification

### **Backend Checks**

- [ ] Health endpoint responds: `https://your-backend.com/api/health`
- [ ] CORS is configured correctly
- [ ] File uploads work
- [ ] Analysis returns results
- [ ] Rate limiting is active

### **Frontend Checks**

- [ ] Site loads correctly
- [ ] Single file upload works
- [ ] Bulk upload works
- [ ] Reports display correctly
- [ ] CSV export works
- [ ] Mobile responsive

---

## 🔧 Common Issues

### **CORS Errors**

- Update `FRONTEND_URL` in backend `.env`
- Add domain to `CORS_ALLOWED_ORIGINS`

### **API Key Issues**

- Verify API key is correct
- Check API key has proper permissions
- Ensure no extra spaces in `.env` file

### **Build Failures**

- Check Node.js version (20+)
- Clear `node_modules` and reinstall
- Check for missing dependencies

### **File Upload Issues**

- Verify `uploads` directory exists
- Check file size limits
- Ensure proper permissions

---

## 📈 Monitoring

### **Backend Monitoring**

- Monitor API response times
- Track error rates
- Watch rate limit hits
- Monitor storage usage

### **Frontend Monitoring**

- Use Vercel Analytics
- Monitor build success rate
- Track Core Web Vitals
- Monitor API call failures

---

## 🔄 Updates and Maintenance

### **Updating Backend**

```bash
git pull origin main
cd backend
npm install
# Restart server
```

### **Updating Frontend**

```bash
git pull origin main
cd frontend
npm install
npm run build
# Deploy automatically triggers on Vercel/Netlify
```

---

## 🆘 Support

If you encounter issues:

1. Check logs in hosting dashboard
2. Verify environment variables
3. Test locally first
4. Check [GitHub Issues](https://github.com/AdityaShukla-1411/code-evaluator-unified/issues)
5. Contact: adityashukla1414@gmail.com

---

## 📝 Production Checklist

- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] File cleanup scheduled
- [ ] Monitoring set up
- [ ] Backups configured (for reports)
- [ ] SSL/HTTPS enabled
- [ ] Domain configured
- [ ] Testing completed
- [ ] Documentation updated

---

**🎉 Your app is ready for production!**
