# API Documentation

## Base URL

**Production:**
```
https://your-service.onrender.com
```

**Development:**
```
http://localhost:3000
```

## Endpoints

### GET /

Health check endpoint.

**Response:**
```json
{
  "status": "Server running",
  "message": "AI Video Clipper API is active",
  "endpoint": "POST /process-video"
}
```

---

### POST /process-video

Process a video URL and generate AI-powered short-form clips.

**Request Body:**

```json
{
  "videoUrl": "https://example.com/video.mp4"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| videoUrl | string | Yes | Direct URL to video file (MP4, MOV, AVI, WebM) |

**Response (Success):**

```json
{
  "success": true,
  "clips": [
    {
      "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/clip_1234567890_1.mp4",
      "title": "Key productivity hack",
      "start": 45.5,
      "end": 78.3,
      "duration": 32.8
    },
    {
      "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/clip_1234567890_2.mp4",
      "title": "Surprising statistic",
      "start": 120.0,
      "end": 155.7,
      "duration": 35.7
    }
  ],
  "metadata": {
    "totalClips": 2,
    "videoDuration": 180.5
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Invalid video URL"
}
```

**Status Codes:**

- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `500` - Internal Server Error

---

## Example Usage

### cURL

```bash
curl -X POST https://your-service.onrender.com/process-video \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://example.com/video.mp4"}'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('https://your-service.onrender.com/process-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    videoUrl: 'https://example.com/video.mp4'
  })
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

response = requests.post(
    'https://your-service.onrender.com/process-video',
    json={'videoUrl': 'https://example.com/video.mp4'}
)

data = response.json()
print(data)
```

### Node.js with Axios

```javascript
const axios = require('axios');

const response = await axios.post(
  'https://your-service.onrender.com/process-video',
  { videoUrl: 'https://example.com/video.mp4' },
  { timeout: 600000 }
);

console.log(response.data);
```

---

## Rate Limits

**Free Tier (Render):**
- 750 hours/month
- No explicit request limits
- Resource constraints apply

**OpenAI API:**
- Whisper: 50 requests/minute (varies by tier)
- GPT-4: 500 tokens/minute (varies by tier)
- Implement exponential backoff for rate limit errors

**Cloudinary:**
- Free tier: 25 credits/month
- Each video upload uses credits

---

## Processing Pipeline

1. **Download Video** (5-30 seconds)
   - Downloads video from provided URL
   - Supports MP4, MOV, AVI, WebM

2. **Extract Audio** (10-30 seconds)
   - Converts to MP3 format
   - Uses FFmpeg

3. **Transcribe** (30-120 seconds)
   - Uses OpenAI Whisper API
   - Returns timestamped segments

4. **Analyze** (10-30 seconds)
   - GPT-4 identifies engaging moments
   - Returns 3-5 clip segments

5. **Generate Clips** (30-120 seconds per clip)
   - Cuts video at identified timestamps
   - Converts to vertical (9:16) format
   - Optimizes for social media

6. **Upload** (10-60 seconds per clip)
   - Uploads to Cloudinary CDN
   - Returns public URLs

**Total Time:** 3-10 minutes depending on video length and complexity

---

## Video Requirements

**Supported Formats:**
- MP4 (recommended)
- MOV
- AVI
- WebM
- MKV

**Recommended Settings:**
- Duration: Under 10 minutes
- File size: Under 200MB
- Resolution: Any (will be resized to 1080x1920)
- Audio: Clear speech for best results

**Unsupported:**
- Password-protected videos
- Live streams
- Videos behind login walls
- Very low quality videos (< 360p)

---

## Error Handling

All errors return JSON with `success: false`:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid video URL | URL doesn't exist or is malformed | Check URL format and accessibility |
| Download failed | Network issues or video unavailable | Try again or use different URL |
| No speech detected | Video has no audio track | Use video with clear audio |
| Transcription failed | API error or file corruption | Retry or use different video |
| Analysis failed | GPT-4 error | Retry with shorter video |
| Clip generation failed | FFmpeg error | Check video format |
| Upload failed | Cloudinary error | Check credentials and quotas |

---

## Best Practices

### For Best Results

1. **Use high-quality videos**
   - Clear audio
   - Good lighting
   - Stable camera

2. **Optimal video length**
   - 3-10 minutes for best clip extraction
   - Shorter videos = fewer clips
   - Longer videos = more processing time

3. **Content variety**
   - Multiple topics = more clip options
   - Consistent content = cohesive clips

### Production Usage

1. **Implement retry logic**
   - Use exponential backoff
   - Maximum 3 retries

2. **Monitor costs**
   - Track API usage
   - Use budget alerts

3. **Handle timeouts**
   - Set appropriate timeouts (10-15 minutes)
   - Implement job queues for long videos

4. **Cache results**
   - Store clip URLs
   - Avoid reprocessing same videos

---

## Webhook Integration (Future)

Coming soon: Webhook notifications when processing completes.

```json
{
  "event": "video.processed",
  "data": {
    "success": true,
    "clips": [...]
  }
}
```

---

## SDK Support

### JavaScript/TypeScript SDK

Coming soon.

### Python SDK

Coming soon.

---

## Support

- **Documentation**: See README.md
- **Issues**: Create GitHub issue
- **Email**: your-email@example.com
