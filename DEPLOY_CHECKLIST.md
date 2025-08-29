# ✅ ULeary Deployment Checklist

## Pre-Deployment Setup ✅

- [x] Frontend configured for production builds
- [x] Backend configured with CORS and environment variables
- [x] Deployment configuration files created
- [x] Documentation written

## Required Environment Variables

### For Backend Deployment:

```bash
NODE_ENV=production
OPENAI_API_KEY=your_openai_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here  # Optional
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### For Frontend Deployment:

```bash
VITE_API_URL=https://your-backend-domain.railway.app
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select `/backend` folder as root
4. Add environment variables
5. Deploy

### Step 2: Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Set root directory to `/` (project root)
4. Add `VITE_API_URL` environment variable
5. Deploy

### Step 3: Update URLs

1. Copy backend URL from Railway
2. Update `VITE_API_URL` in Vercel
3. Copy frontend URL from Vercel
4. Update `FRONTEND_URL` in Railway
5. Redeploy both if needed

## 🧪 Testing

After deployment, test:

- [ ] Homepage loads correctly
- [ ] File upload works
- [ ] Text processing works
- [ ] All three processing types (summary, quiz, lecture)
- [ ] Error handling
- [ ] CORS is working

## 💰 Estimated Costs

**Free Tier (Perfect for MVP):**

- Vercel: $0/month
- Railway: $0/month (with $5 credit)
- **Total: $0/month**

**Production Ready:**

- Vercel Pro: $20/month
- Railway Pro: $20/month
- **Total: $40/month**

## 🔧 Files Created/Modified

### Modified:

- `src/services/apiService.js` - Environment variable support
- `vite.config.js` - Production build optimization
- `package.json` - Build scripts
- `backend/server.js` - Production configuration
- `backend/package.json` - Deployment scripts

### Created:

- `vercel.json` - Vercel configuration
- `backend/railway.toml` - Railway configuration
- `backend/Dockerfile` - Container deployment option
- `DEPLOYMENT.md` - Complete deployment guide
- `DEPLOY_CHECKLIST.md` - This checklist

## 🚨 Important Notes

1. **API Keys**: Never commit API keys to git
2. **CORS**: Must be configured correctly for production
3. **File Uploads**: 50MB limit configured
4. **Domain**: Update both frontend and backend URLs after deployment

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section in `DEPLOYMENT.md`
2. Verify all environment variables are set
3. Check deployment logs in Vercel/Railway dashboards
