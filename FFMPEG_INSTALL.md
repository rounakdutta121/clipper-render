# FFmpeg Installation Guide

## macOS

```bash
# Using Homebrew (recommended)
brew install ffmpeg

# Verify installation
ffmpeg -version
```

## Ubuntu/Debian

```bash
# Update package list
sudo apt-get update

# Install FFmpeg
sudo apt-get install -y ffmpeg

# Verify installation
ffmpeg -version
```

## Windows

### Option 1: Download Binary
1. Go to https://ffmpeg.org/download.html
2. Download Windows builds
3. Extract to a folder (e.g., `C:\ffmpeg`)
4. Add to PATH:
   - Open System Properties → Advanced → Environment Variables
   - Edit PATH and add `C:\ffmpeg\bin`
5. Verify: Open new command prompt and run `ffmpeg -version`

### Option 2: Using Chocolatey
```bash
# Install Chocolatey first if not installed
# Then run:
choco install ffmpeg

# Verify
ffmpeg -version
```

### Option 3: Using Winget
```bash
winget install ffmpeg

# Verify
ffmpeg -version
```

## Render.com

FFmpeg needs to be installed on each deployment. Add to your start command:

```bash
bash -c 'sudo apt-get update && sudo apt-get install -y ffmpeg && npm start'
```

Or in `render.yaml`:

```yaml
startCommand: bash -c 'sudo apt-get update && sudo apt-get install -y ffmpeg && npm start'
```

## Verify FFmpeg Installation

```bash
ffmpeg -version
```

Should output something like:
```
ffmpeg version 4.4.1 Copyright (c) 2000-2021 the FFmpeg developers
```

## Troubleshooting

### "ffmpeg: command not found"
- FFmpeg is not installed or not in PATH
- Restart your terminal after installation
- Verify PATH includes FFmpeg directory

### "Permission denied" on Render
- Ensure startup command includes FFmpeg installation
- Check Render logs for specific errors

### Build takes too long on Render
- FFmpeg installation adds ~30 seconds to build
- Consider using a persistent disk with FFmpeg pre-installed

## Audio/Video Codecs

For full codec support, install additional packages:

### Ubuntu/Debian
```bash
sudo apt-get install -y ffmpeg libavcodec-extra
```

### macOS (Homebrew)
```bash
brew install ffmpeg --with-libvpx --with-libvorbis --with-libx265
```
