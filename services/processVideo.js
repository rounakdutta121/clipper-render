const path = require('path');
const fs = require('fs-extra');
const { downloadVideo } = require('./download');
const { extractAudio } = require('./transcribe');
const { transcribeAudio } = require('./transcribe');
const { analyzeTranscript } = require('./analyze');
const { generateClips } = require('./clipper');
const { uploadClips } = require('./uploader');
const { checkFFmpeg } = require('../utils/ffmpeg');

async function processVideo(videoUrl) {
  const tempDir = path.join(process.cwd(), 'temp');
  const videoPath = path.join(tempDir, 'input.mp4');
  const audioPath = path.join(tempDir, 'audio.mp3');
  const clipsDir = path.join(tempDir, 'clips');

  await fs.ensureDir(tempDir);
  await fs.ensureDir(clipsDir);

  try {
    await checkFFmpeg();

    await downloadVideo(videoUrl, videoPath);

    await extractAudio(videoPath, audioPath);

    const transcription = await transcribeAudio(audioPath);

    if (!transcription.segments || transcription.segments.length === 0) {
      throw new Error('No speech detected in video');
    }

    const segments = await analyzeTranscript(transcription);

    if (!segments || segments.length === 0) {
      throw new Error('No engaging segments found in transcript');
    }

    const clips = await generateClips(videoPath, segments, clipsDir);

    const uploadedClips = await uploadClips(clips);

    await cleanup([tempDir]);

    return {
      success: true,
      clips: uploadedClips,
      metadata: {
        totalClips: uploadedClips.length,
        videoDuration: transcription.duration
      }
    };

  } catch (error) {
    console.error('❌ Video processing failed:', error);
    
    await cleanup([tempDir]);

    throw error;
  }
}

async function cleanup(dirs) {
  console.log('🧹 Cleaning up temporary files...');
  
  for (const dir of dirs) {
    try {
      await fs.remove(dir);
      console.log(`   ✅ Cleaned up: ${dir}`);
    } catch (error) {
      console.warn(`   ⚠️ Failed to clean up ${dir}:`, error.message);
    }
  }
}

module.exports = { processVideo };
