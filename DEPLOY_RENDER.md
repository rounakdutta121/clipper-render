# Deployment Checklist for Render.com

## Prerequisites
- [ ] GitHub account
- [ ] Render.com account
- [ ] OpenAI API key
- [ ] Cloudinary account with API credentials

## Step 1: Prepare Repository

1. Clone or create the project
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your credentials in `.env`
4. Commit all files (except `.env` and `node_modules/`)

## Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Verify email

## Step 3: Deploy via Dashboard

### Option A: Blueprints (Recommended)

1. Push `render.yaml` to GitHub
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Add environment variables:
   - OPENAI_API_KEY
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
6. Click "Apply"

### Option B: Manual Deploy

1. In Render dashboard, click "New" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: ai-video-clipper
   - **Region**: Oregon (or closest to you)
   - **Branch**: main
   - **Root Directory**: (leave blank)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `bash -c 'sudo apt-get update && sudo apt-get install -y ffmpeg && npm start'`
   - **Plan**: Starter (free tier)
4. Add Environment Variables:
   - OPENAI_API_KEY = your_key
   - CLOUDINARY_CLOUD_NAME = your_cloud_name
   - CLOUDINARY_API_KEY = your_api_key
   - CLOUDINARY_API_SECRET = your_api_secret
   - NODE_ENV = production
   - PORT = 3000
5. Click "Create Web Service"

## Step 4: Verify Deployment

1. Wait for deployment to complete (2-5 minutes)
2. Check logs for errors
3. Test health endpoint: `https://your-service.onrender.com/`
4. Should return: `{"status":"Server running",...}`

## Step 5: Test the API

```bash
curl -X POST https://your-service.onrender.com/process-video \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://example.com/video.mp4"}'
```

Or use the test script:
```bash
node test.js https://example.com/video.mp4
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| OPENAI_API_KEY | Yes | OpenAI API key for Whisper & GPT |
| CLOUDINARY_CLOUD_NAME | Yes | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Yes | Cloudinary API key |
| CLOUDINARY_API_SECRET | Yes | Cloudinary API secret |
| PORT | No | Server port (default: 3000) |
| NODE_ENV | No | Environment (production/development) |

## Common Issues & Solutions

### "FFmpeg not found"
**Solution**: Ensure start command includes FFmpeg installation

### "Timeout on long videos"
**Solution**: Videos over 5 minutes may timeout on free tier. Use paid plan or optimize video length.

### "API rate limits"
**Solution**: OpenAI has rate limits. Implement exponential backoff or use multiple API keys.

### "Out of memory"
**Solution**: Process shorter videos or upgrade to paid tier with more RAM.

## Monitoring

- Check Render dashboard for logs
- Monitor OpenAI API usage at https://platform.openai.com/usage
- Monitor Cloudinary usage at https://cloudinary.com/console

## Cost Estimation

- **Render Starter**: Free (shared CPU, 512MB RAM, 750 hours/month)
- **OpenAI**: ~$0.006/minute for Whisper, ~$0.03 for GPT-4 analysis
- **Cloudinary**: Free tier includes 25 credits/month

## Security Best Practices

1. Never commit `.env` file
2. Use Render's encrypted environment variables
3. Enable auto-scaling for production
4. Implement rate limiting (not included, add express-rate-limit)
5. Use HTTPS only

## Performance Tips

1. Keep videos under 5 minutes for faster processing
2. Use videos under 100MB
3. Process during off-peak hours if using free tier
4. Consider async processing for production (not included)

## Support

- Render Docs: https://render.com/docs
- OpenAI Support: https://help.openai.com
- Cloudinary Support: https://support.cloudinary.com
