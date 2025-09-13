# 🚀 ULeary Deployment Guide

This guide covers deploying your ULeary application to production.

## 📋 Prerequisites

1. GitHub repository with your code
2. Google Gemini API key
3. ElevenLabs API key (optional)

## 🎯 Quick Deploy (Free Option)

### Frontend - Vercel

1. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Environment Variables:**

   ```bash
   VITE_API_URL=https://your-backend-url.railway.app
   ```

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your frontend will be live at `https://your-app.vercel.app`

### Backend - Railway

1. **Connect to Railway:**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure Environment Variables:**

   ```bash
   NODE_ENV=production
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   FRONTEND_URL=https://your-app.vercel.app
   ```

3. **Deploy:**
   - Railway will automatically build and deploy
   - Your backend will be live at `https://your-backend.railway.app`

## 🔄 Update Frontend with Backend URL

After deploying your backend, update the frontend environment variable:

1. Go to your Vercel project settings
2. Update `VITE_API_URL` to your Railway backend URL
3. Redeploy the frontend

## 🛡️ Environment Variables Reference

### Frontend (.env)

```bash
VITE_API_URL=https://your-backend-domain.railway.app
```

### Backend (.env)

```bash
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=...
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🔍 Alternative Deployment Options

### Option 2: Netlify + Render

- **Frontend**: Netlify (similar to Vercel)
- **Backend**: Render (similar to Railway)

### Option 3: DigitalOcean App Platform

- Deploy both frontend and backend together
- Single platform management
- ~$12/month

### Option 4: AWS/Google Cloud

- Maximum control and scalability
- Requires more DevOps knowledge
- Variable pricing

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**

   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that frontend is using correct API URL

2. **API Key Issues:**

   - Verify Google Gemini API key is valid
   - Check ElevenLabs API key if using text-to-speech

3. **Build Failures:**
   - Check Node.js version compatibility (use Node 18+)
   - Verify all dependencies are in package.json

## 📊 Cost Breakdown

### Free Tier (MVP):

- Vercel: Free (100GB bandwidth)
- Railway: Free ($5 credit monthly)
- **Total: $0/month**

### Production Ready:

- Vercel Pro: $20/month
- Railway Pro: $20/month
- **Total: $40/month**

## 🔐 Security Checklist

- [ ] API keys stored in environment variables
- [ ] CORS configured for production domains
- [ ] HTTPS enabled (automatic with Vercel/Railway)
- [ ] File upload limits configured
- [ ] Rate limiting implemented (optional)

## 📈 Monitoring

### Built-in Options:

- Vercel Analytics (frontend performance)
- Railway Metrics (backend performance)

### Advanced Options:

- Sentry for error tracking
- LogRocket for user session replay
- Uptime monitoring (Pingdom, UptimeRobot)

## 🚀 Custom Domain (Optional)

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS:**
   - Frontend: Point to Vercel
   - Backend: Point to Railway
3. **SSL certificates** will be automatically generated

---

## 🎉 You're Live!

Once deployed, your app will be accessible worldwide. Share the link and start getting users!

**Need help?** Check the troubleshooting section or create an issue in the repository.
