# Docker

## Quick Start

### Build Image
```bash
docker build -t ai-video-clipper .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e CLOUDINARY_CLOUD_NAME=your_cloud \
  -e CLOUDINARY_API_KEY=your_key \
  -e CLOUDINARY_API_SECRET=your_secret \
  ai-video-clipper
```

### Using Docker Compose

```bash
# Create .env file
cp .env.example .env

# Edit .env with your credentials

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Volumes

The `temp` directory is mounted to persist temporary files and enable debugging.

## Ports

- Local: `http://localhost:3000`
- Container: `3000`

## Troubleshooting

### Container exits immediately
Check logs: `docker-compose logs`

### Out of memory
Increase Docker memory in Docker Desktop settings

### FFmpeg not found
Ensure Dockerfile installs FFmpeg correctly

## Production Deployment

For production with Docker:

```bash
# Build
docker build -t ai-video-clipper:prod .

# Run with resource limits
docker run -d \
  --name ai-video-clipper \
  -p 3000:3000 \
  --memory="1g" \
  --cpus="1" \
  -e NODE_ENV=production \
  -e OPENAI_API_KEY=your_key \
  -e CLOUDINARY_CLOUD_NAME=your_cloud \
  -e CLOUDINARY_API_KEY=your_key \
  -e CLOUDINARY_API_SECRET=your_secret \
  --restart unless-stopped \
  ai-video-clipper:prod
```
