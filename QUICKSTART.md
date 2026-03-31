# Quick Start Guide

Get your AI Video Clipper running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- FFmpeg installed
- OpenAI API key
- Cloudinary account

## Step 1: Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html

Verify installation:
```bash
ffmpeg -version
```

## Step 2: Get API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Cloudinary Credentials
1. Go to https://cloudinary.com/console
2. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Setup Project

```bash
# Clone or create project directory
cd ai-video-clipper

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Your `.env` should look like:
```
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop
PORT=3000
```

## Step 4: Start Server

```bash
npm start
```

You should see:
```
🚀 AI Video Clipper server running on port 3000
📁 Working directory: /path/to/project
✅ FFmpeg is available
```

## Step 5: Test It!

### Using cURL:

```bash
curl -X POST http://localhost:3000/process-video \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://example.com/video.mp4"}'
```

### Using the test script:

```bash
node test.js https://example.com/video.mp4
```

### Using Postman:

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3000/process-video`
4. Body (raw JSON):
   ```json
   {
     "videoUrl": "https://example.com/video.mp4"
   }
   ```
5. Click Send

## What Happens Next?

1. **Downloading...** (5-30 sec)
   - Console: `📥 Step 1: Downloading video...`

2. **Extracting audio...** (10-30 sec)
   - Console: `🎵 Step 2: Extracting audio...`

3. **Transcribing...** (30-120 sec)
   - Console: `🎙️ Step 3: Transcribing audio with Whisper...`

4. **Analyzing...** (10-30 sec)
   - Console: `🧠 Step 4: Analyzing transcript with GPT...`

5. **Generating clips...** (30-120 sec per clip)
   - Console: `✂️ Step 5: Generating clips from segments...`

6. **Uploading...** (10-60 sec per clip)
   - Console: `☁️ Step 6: Uploading clips to Cloudinary...`

7. **Cleaning up...**
   - Console: `🧹 Cleaning up temporary files...`

8. **Done!**
   - Response contains clip URLs

## Expected Output

```json
{
  "success": true,
  "clips": [
    {
      "url": "https://res.cloudinary.com/...",
      "title": "Key insight",
      "start": 30.5,
      "end": 65.2,
      "duration": 34.7
    }
  ],
  "metadata": {
    "totalClips": 1,
    "videoDuration": 180.5
  }
}
```

## Troubleshooting

### "FFmpeg not found"
**Solution:** Install FFmpeg and restart terminal

### "OpenAI API error"
**Solution:** Check your API key is correct in `.env`

### "Cloudinary upload failed"
**Solution:** Verify Cloudinary credentials and check quota

### "Video download failed"
**Solution:** Check if URL is accessible and direct video link

### "No speech detected"
**Solution:** Video must have clear audio track

### "Timeout errors"
**Solution:** Video may be too long. Try under 5 minutes.

## Example Videos to Test

Try these public domain videos:

```bash
# Big Buck Bunny (10 min)
node test.js https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4

# Sintel trailer (1 min)
node test.js https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4
```

## Next Steps

### Deploy to Render
See [DEPLOY_RENDER.md](DEPLOY_RENDER.md) for detailed deployment instructions.

### Use Docker
See [DOCKER.md](DOCKER.md) for containerized deployment.

### Explore the Code
- `server.js` - Express server setup
- `services/processVideo.js` - Main orchestration
- `services/analyze.js` - AI analysis logic
- `services/clipper.js` - Video processing

## Common Use Cases

### 1. Podcast Clips
```bash
node test.js https://podcast.example.com/episode-123.mp4
```

### 2. Tutorial Highlights
```bash
node test.js https://tutorial.example.com/lesson-1.mp4
```

### 3. Interview Highlights
```bash
node test.js https://interview.example.com/part-1.mp4
```

### 4. Lecture Key Points
```bash
node test.js https://course.example.com/lecture-5.mp4
```

## Performance Tips

1. **Use shorter videos** (3-5 min) for faster processing
2. **Use MP4 format** for best compatibility
3. **Clear audio** produces better transcriptions
4. **Close other apps** to free up memory

## Cost Estimation

Processing a 5-minute video:

- **Whisper**: ~$0.003
- **GPT-4**: ~$0.01
- **Cloudinary**: ~1 credit
- **Total**: ~$0.02 per video

## Need Help?

- Check [API.md](API.md) for detailed API documentation
- Check [README.md](README.md) for full project documentation
- Create GitHub issue for bugs

## Next Features

Coming soon:
- [ ] Webhook notifications
- [ ] Batch processing
- [ ] Custom clip lengths
- [ ] Multiple aspect ratios
- [ ] Custom AI prompts
- [ ] Video watermarking

---

**Happy clipping! 🎬✨**
