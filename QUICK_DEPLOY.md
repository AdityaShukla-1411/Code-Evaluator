# 🚀 Quick Deploy Guide

Deploy Code Evaluator Unified for **FREE** in minutes! Choose your preferred platform below.

---

## ⚡ Option 1: Render.com (Recommended - Easiest!)

**✅ Best for:** Full-stack deployment (Backend + Frontend)  
**✅ Cost:** FREE forever (with some limitations)  
**✅ Setup time:** 5 minutes

### One-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AdityaShukla-1411/Code-Evaluator)

**Steps:**

1. Click the "Deploy to Render" button above
2. Sign in with GitHub
3. Name your services (or use defaults)
4. **IMPORTANT:** Add your Gemini API Key in the environment variables
   - Get your free API key from: https://ai.google.dev/
5. Click "Apply" and wait 5-10 minutes for deployment
6. Done! Your app is live! 🎉

**What gets deployed:**
- ✅ Backend API (Node.js) on `https://your-backend.onrender.com`
- ✅ Frontend (Next.js) on `https://your-frontend.onrender.com`
- ✅ Automatic linking between services
- ✅ Free SSL certificates

**Free Tier Limitations:**
- ⚠️ Backend sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds
- ✅ 750 hours/month free (enough for hobby projects)

---

## 🔷 Option 2: Vercel (Frontend) + Railway (Backend)

**✅ Best for:** Maximum performance with generous free tier  
**✅ Cost:** FREE (Vercel) + FREE (Railway with $5 credit)  
**✅ Setup time:** 10 minutes

### Deploy Frontend to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AdityaShukla-1411/Code-Evaluator&project-name=code-evaluator&repository-name=code-evaluator&root-directory=frontend&env=NEXT_PUBLIC_API_URL&envDescription=Backend%20API%20URL&envLink=https://github.com/AdityaShukla-1411/Code-Evaluator/blob/main/QUICK_DEPLOY.md)

**Steps:**

1. Click "Deploy with Vercel" button
2. Sign in with GitHub
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (get this after deploying backend)
4. Deploy!

### Deploy Backend to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/AdityaShukla-1411/Code-Evaluator&plugins=&envs=GEMINI_API_KEY&GEMINI_API_KEYDesc=Your+Gemini+API+Key+from+https://ai.google.dev/)

**Steps:**

1. Click "Deploy on Railway" button
2. Sign in with GitHub
3. Add environment variables:
   - `GEMINI_API_KEY`: Your Gemini API key from https://ai.google.dev/
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL
4. Deploy!
5. Copy the Railway backend URL
6. Update Vercel environment variable with the backend URL

---

## 🐳 Option 3: Docker Compose (Self-Hosted)

**✅ Best for:** Complete control, self-hosting  
**✅ Cost:** FREE (your own infrastructure)  
**✅ Setup time:** 15 minutes

### Prerequisites
- Docker and Docker Compose installed
- Your own server or local machine

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaShukla-1411/Code-Evaluator.git
   cd Code-Evaluator
   ```

2. **Create environment file**
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Edit backend/.env and add your Gemini API key**
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - GEMINI_API_KEY=${GEMINI_API_KEY}
         - NODE_ENV=production
         - CORS_ALLOWED_ORIGINS=http://localhost:3000
       volumes:
         - ./backend/reports:/app/reports
         - ./backend/uploads:/app/uploads

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://localhost:5000
       depends_on:
         - backend
   ```

5. **Deploy**
   ```bash
   docker-compose up -d
   ```

6. **Access your app**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

---

## 🌐 Option 4: Netlify (Frontend) + Render (Backend)

**✅ Best for:** Combining best-in-class hosting  
**✅ Cost:** FREE  
**✅ Setup time:** 10 minutes

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AdityaShukla-1411/Code-Evaluator)

**Configuration:**
- **Base directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `frontend/out`
- **Environment variable:** `NEXT_PUBLIC_API_URL=<your-backend-url>`

### Deploy Backend to Render
Follow Render Option 1 for backend deployment.

---

## 📋 Post-Deployment Checklist

After deploying, verify everything works:

- [ ] Backend health check: `https://your-backend-url/api/health`
- [ ] Frontend loads successfully
- [ ] Can upload and analyze code files
- [ ] Bulk processing works
- [ ] CSV export functions correctly
- [ ] No CORS errors in browser console

---

## 🔑 Getting Your Gemini API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key"
3. Sign in with Google
4. Create a new project
5. Generate API key
6. Copy and save it securely
7. Add it to your deployment environment variables

**⚠️ IMPORTANT:** Never commit your API key to GitHub!

---

## 🆘 Troubleshooting

### Backend shows "Application failed to respond"
- ✅ Check Gemini API key is set correctly
- ✅ Verify environment variables in dashboard
- ✅ Check deployment logs for errors

### Frontend shows "Failed to fetch"
- ✅ Verify backend URL is correct
- ✅ Check backend is running (health endpoint)
- ✅ Update CORS_ALLOWED_ORIGINS in backend

### "Publish directory not found"
- ✅ For Next.js static export, use `out` directory
- ✅ Verify `output: 'export'` in next.config.js
- ✅ Check build logs for errors

---

## 💰 Cost Comparison

| Platform        | Frontend | Backend | Total/Month |
|----------------|----------|---------|-------------|
| **Render**     | Free     | Free*   | $0          |
| **Vercel + Railway** | Free | Free*   | $0          |
| **Netlify + Render** | Free | Free*   | $0          |
| **Self-hosted** | Free    | Free    | $0          |

\* *Free tier with some limitations (sleep after inactivity)*

**Upgrade Options:**
- Render Pro: $7/month (no sleep)
- Railway Hobby: $5 credit (then pay-as-you-go)
- Vercel Pro: $20/month (commercial use)

---

## 🎯 Recommended Setup for Different Use Cases

### 👨‍🎓 **Students / Learning**
→ **Render (Option 1)** - Easiest, completely free

### 💼 **Portfolio / Resume**
→ **Vercel + Railway (Option 2)** - Professional, fast

### 🏫 **Educational Institution**
→ **Self-hosted (Option 3)** - Full control, private

### 🚀 **Production / Commercial**
→ Upgrade to paid tiers with custom domains

---

## 📞 Need Help?

- 📖 Detailed guides: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📖 Render specific: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- 🐛 Issues: [GitHub Issues](https://github.com/AdityaShukla-1411/Code-Evaluator/issues)
- 📧 Email: adityashukla1414@gmail.com

---

## 🎉 Success!

Once deployed, share your achievement:
- ⭐ Star this repository
- 📱 Add to your portfolio
- 💼 Share on LinkedIn
- 🎓 Add to your resume

**Your Code Evaluator is now live on the internet!** 🚀

---

Made with ❤️ by [Aditya Shukla](https://github.com/AdityaShukla-1411)
