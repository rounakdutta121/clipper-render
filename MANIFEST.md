# Project Manifest

## AI Video Clipper Backend

A production-ready Node.js Express server that processes videos to create AI-generated short-form clips optimized for TikTok, Instagram Reels, and YouTube Shorts.

---

## 📁 Project Structure

```
ai-video-clipper/
├── 📄 server.js                    # Express server entry point
├── 📄 package.json                  # NPM dependencies and scripts
├── 📄 render.yaml                  # Render.com deployment blueprint
├── 📄 Dockerfile                   # Docker container configuration
├── 📄 docker-compose.yml           # Docker Compose setup
│
├── 📂 routes/
│   └── processVideo.js             # POST /process-video endpoint
│
├── 📂 services/
│   ├── processVideo.js             # Main orchestration service
│   ├── download.js                # Video download using Axios
│   ├── transcribe.js              # Audio extraction & Whisper API
│   ├── analyze.js                 # GPT-4 analysis for clip detection
│   ├── clipper.js                 # FFmpeg clip generation
│   └── uploader.js                # Cloudinary upload service
│
├── 📂 utils/
│   └── ffmpeg.js                  # FFmpeg wrapper utilities
│
├── 📂 docs/
│   ├── README.md                  # Project documentation
│   ├── QUICKSTART.md              # 5-minute setup guide
│   ├── API.md                     # API reference
│   ├── DEPLOY_RENDER.md           # Render.com deployment guide
│   ├── DOCKER.md                  # Docker setup guide
│   └── FFMPEG_INSTALL.md          # FFmpeg installation guide
│
├── 📂 .env.example                 # Environment variables template
├── 📂 .gitignore                   # Git ignore patterns
└── 📂 test.js                      # API testing script
```

---

## 🎯 Features

✅ **Video Download** - Downloads from any direct URL  
✅ **Audio Extraction** - FFmpeg-powered MP3 conversion  
✅ **Speech Transcription** - OpenAI Whisper API  
✅ **AI Analysis** - GPT-4 identifies engaging moments  
✅ **Clip Generation** - FFmpeg creates vertical 9:16 clips  
✅ **Cloud Upload** - Cloudinary CDN integration  
✅ **Auto Cleanup** - Temporary files removed automatically  
✅ **Error Handling** - Comprehensive try/catch with structured errors  

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your API keys

# 3. Start server
npm start

# 4. Test API
curl -X POST http://localhost:3000/process-video \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://example.com/video.mp4"}'
```

---

## 🔧 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **AI:** OpenAI (Whisper + GPT-4)
- **Video:** FFmpeg
- **Storage:** Cloudinary
- **HTTP Client:** Axios
- **File System:** fs-extra

---

## 📋 Dependencies

```json
{
  "express": "^4.18.2",
  "axios": "^1.6.2",
  "dotenv": "^16.3.1",
  "cloudinary": "^1.41.0",
  "openai": "^4.20.1",
  "fluent-ffmpeg": "^2.1.2",
  "fs-extra": "^11.2.0"
}
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| OPENAI_API_KEY | Yes | OpenAI API key |
| CLOUDINARY_CLOUD_NAME | Yes | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Yes | Cloudinary API key |
| CLOUDINARY_API_SECRET | Yes | Cloudinary API secret |
| PORT | No | Server port (default: 3000) |

---

## 🌐 API Endpoint

### POST /process-video

**Request:**
```json
{
  "videoUrl": "https://example.com/video.mp4"
}
```

**Response:**
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

---

## 📊 Processing Pipeline

1. **📥 Download** - Fetch video from URL (5-30s)
2. **🎵 Extract** - Convert to MP3 (10-30s)
3. **🎙️ Transcribe** - Whisper API (30-120s)
4. **🧠 Analyze** - GPT-4 finds moments (10-30s)
5. **✂️ Cut** - Generate clips (30-120s each)
6. **☁️ Upload** - Cloudinary CDN (10-60s each)
7. **🧹 Cleanup** - Remove temp files

**Total:** 3-10 minutes per video

---

## 🐳 Deployment Options

### Render.com (Recommended)
```bash
# Use render.yaml blueprint
renderctl blueprints deploy
```

### Docker
```bash
docker-compose up -d
```

### Manual
```bash
# Install FFmpeg
sudo apt-get install -y ffmpeg

# Start server
npm start
```

---

## 📖 Documentation

- **[README.md](README.md)** - Full project documentation
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[API.md](API.md)** - API reference and examples
- **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)** - Render deployment guide
- **[DOCKER.md](DOCKER.md)** - Docker setup guide
- **[FFMPEG_INSTALL.md](FFMPEG_INSTALL.md)** - FFmpeg installation

---

## 💰 Cost Estimation

Processing a 5-minute video:
- **Whisper:** ~$0.003
- **GPT-4:** ~$0.01
- **Cloudinary:** ~1 credit
- **Total:** ~$0.02 per video

---

## ⚙️ Requirements

- Node.js 18+
- FFmpeg
- OpenAI API key
- Cloudinary account

---

## 🎨 Clip Specifications

- **Aspect Ratio:** 9:16 (vertical)
- **Resolution:** 1080x1920
- **Format:** MP4 (H.264)
- **Audio:** AAC 128kbps
- **Duration:** 15-60 seconds

---

## 🔒 Security

- Environment variables for all secrets
- No credentials in code
- HTTPS-only in production
- Input validation
- Error sanitization

---

## 📈 Performance

- **Max Video Length:** 10 minutes
- **Recommended:** 3-5 minutes
- **Memory Usage:** ~512MB
- **Processing:** Sequential (not parallel)
- **Timeout:** 10 minutes

---

## 🐛 Error Handling

All errors return structured JSON:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common errors:
- Invalid video URL
- Download failure
- No speech detected
- Transcription failure
- Clip generation failure
- Upload failure

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Credits

- OpenAI - Whisper & GPT
- FFmpeg - Video processing
- Cloudinary - Video CDN
- Express.js - Web framework

---

## 📞 Support

- **Issues:** GitHub Issues
- **Email:** support@example.com
- **Docs:** See docs/ directory

---

## 🔮 Roadmap

- [ ] Webhook notifications
- [ ] Batch processing
- [ ] Custom clip lengths
- [ ] Multiple aspect ratios
- [ ] Custom AI prompts
- [ ] Video watermarking
- [ ] Progress tracking
- [ ] Rate limiting
- [ ] Video analytics

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready 🚀
