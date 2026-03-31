# AI Video Clipper Backend

A production-ready Node.js Express server that automatically processes videos to create AI-generated short-form clips optimized for TikTok, Instagram Reels, and YouTube Shorts.

## Features

- 🎬 Downloads video from URL
- 🎵 Extracts audio using FFmpeg
- 🎙️ Transcribes speech using OpenAI Whisper API
- 🧠 Analyzes content using GPT-4 to find engaging moments
- ✂️ Generates vertical (9:16) clips using FFmpeg
- ☁️ Uploads clips to Cloudinary
- 🧹 Automatic cleanup of temporary files

## Tech Stack

- Node.js + Express
- FFmpeg (via child_process)
- OpenAI API (Whisper + GPT-4)
- Cloudinary SDK
- Axios (video downloads)

## Setup

### 1. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html and add to PATH

**Render.com:**
Add to your `render.yaml` or install via startup script:
```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

### 4. Get API Keys

- **OpenAI API Key**: https://platform.openai.com/api-keys
- **Cloudinary**: https://cloudinary.com/console

## Usage

### Start Server

```bash
npm start
```

### API Endpoint

**POST /process-video**

Request:
```json
{
  "videoUrl": "https://example.com/video.mp4"
}
```

Response:
```json
{
  "success": true,
  "clips": [
    {
      "url": "https://res.cloudinary.com/...",
      "title": "Key insight about productivity",
      "start": 30.5,
      "end": 65.2,
      "duration": 34.7
    }
  ],
  "metadata": {
    "totalClips": 3,
    "videoDuration": 600
  }
}
```

## Deployment on Render

### 1. Create render.yaml (optional)

```yaml
services:
  - type: web
    name: ai-video-clipper
    env: node
    buildCommand: npm install
    startCommand: npm start
    plan: starter
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
```

### 2. Or use Render Dashboard

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`
6. Add FFmpeg installation to startup command or use Render Blueprints

### 3. FFmpeg on Render

Add to your start command or create a startup script:

```bash
#!/bin/bash
sudo apt-get update && sudo apt-get install -y ffmpeg
npm start
```

Or in Render dashboard Start Command:
```
bash -c 'sudo apt-get update && sudo apt-get install -y ffmpeg && npm start'
```

## Error Handling

All errors return structured JSON:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common issues:
- Invalid video URL
- Video too long (> 10 minutes)
- No speech detected
- API rate limits
- FFmpeg not installed

## Project Structure

```
/project
├── server.js              # Express server entry point
├── routes/
│   └── processVideo.js    # API route handler
├── services/
│   ├── processVideo.js    # Main orchestration service
│   ├── download.js        # Video download service
│   ├── transcribe.js      # Audio extraction & transcription
│   ├── analyze.js         # GPT-4 analysis
│   ├── clipper.js         # FFmpeg clip generation
│   └── uploader.js        # Cloudinary upload
├── utils/
│   └── ffmpeg.js          # FFmpeg utilities
├── package.json
├── .env.example
└── README.md
```

## License

MIT
