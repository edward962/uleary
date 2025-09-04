# 🤖 AI Services Setup Guide

This guide will help you connect OpenAI (ChatGPT) and ElevenLabs to your ULeary application.

## 🔑 Step 1: Get Your API Keys

### Anthropic Claude API Key (Required)

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create Key"
5. Copy the API key (starts with `sk-ant-`)
6. **Note**: Includes free tier credits to get started

### ElevenLabs API Key (Optional)

1. Go to [ElevenLabs](https://elevenlabs.io/app/speech-synthesis)
2. Sign up or log in
3. Go to Profile → API Keys
4. Copy your API key
5. **Note**: Free tier includes 10,000 characters/month

## 🔧 Step 2: Create Environment File

1. In your `backend` folder, create a file named `.env`
2. Add the following content:

```bash
# ================================
# ULeary Backend Environment Variables
# ================================

# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# ================================
# AI Services
# ================================

# Anthropic Claude Configuration (Required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# ElevenLabs Configuration (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Specific ElevenLabs voice ID
# ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

3. Replace `your_openai_api_key_here` with your actual OpenAI API key
4. Replace `your_elevenlabs_api_key_here` with your actual ElevenLabs API key

## ⚠️ Important Security Notes

- **Never commit the `.env` file to git** (it's already in .gitignore)
- Keep your API keys private
- Don't share them in screenshots or messages
- Regenerate keys if compromised

## 🧪 Step 3: Test the Connection

After setting up your `.env` file:

1. **Start your backend server:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Test the health endpoint:**
   Open your browser and go to: `http://localhost:3001/health`

   You should see something like:

   ```json
   {
     "status": "OK",
     "message": "ULeary Backend API is running",
     "services": {
       "ai": {
         "available": true,
         "service": "OpenAI",
         "model": "gpt-3.5-turbo",
         "status": "healthy"
       },
       "textToSpeech": {
         "available": true,
         "service": "ElevenLabs",
         "status": "healthy"
       }
     }
   }
   ```

3. **Start your frontend:**
   ```bash
   # In a new terminal, from project root
   npm run dev
   ```

## 🔍 Troubleshooting

### OpenAI Issues:

- **"API key not configured"**: Check your `.env` file exists and has the correct key
- **"Invalid API key"**: Verify the key is correct and active
- **"Billing required"**: Add billing info to your OpenAI account
- **"Rate limit exceeded"**: Wait a few minutes or upgrade your plan

### ElevenLabs Issues:

- **"API key not configured"**: App will work without ElevenLabs, just no audio
- **"Character limit exceeded"**: You've used your monthly quota
- **"Invalid voice ID"**: Use default voice or check available voices

### General Issues:

- **Backend won't start**: Check for typos in `.env` file
- **CORS errors**: Make sure both servers are running on correct ports
- **Mock responses**: If you see "mock" in responses, API keys aren't working

## 💰 Cost Estimates

### OpenAI (GPT-3.5-turbo):

- **Input**: ~$0.50 per 1M tokens
- **Output**: ~$1.50 per 1M tokens
- **Typical usage**: $0.01-0.05 per document processed

### ElevenLabs:

- **Free tier**: 10,000 characters/month
- **Starter plan**: $5/month for 30,000 characters
- **Creator plan**: $22/month for 100,000 characters

## 🎯 Next Steps

Once you have everything working:

1. Test all three processing types (summary, quiz, lecture)
2. Test file uploads and text processing
3. Verify audio generation works (if using ElevenLabs)
4. Ready for deployment! 🚀

## 📞 Need Help?

If you encounter issues:

1. Check the console logs in your terminal
2. Verify your API keys are correct
3. Test the health endpoint first
4. Check the troubleshooting section above
