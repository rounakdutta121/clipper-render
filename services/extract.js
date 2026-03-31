const fs = require('fs');
const path = require('path');
const { execAsync } = require('../utils/ffmpeg');

async function extractAudio(videoPath, audioPath) {
  console.log('🎵 Step 2: Extracting audio...');
  console.log('   Input:', videoPath);

  try {
    await execAsync(
      `ffmpeg -i "${videoPath}" -vn -acodec mp3 -y "${audioPath}"`
    );

    const stats = fs.statSync(audioPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('✅ Audio extracted successfully');
    console.log('   Size:', fileSizeMB, 'MB');
    console.log('   Path:', audioPath);
    
    return audioPath;

  } catch (error) {
    console.error('❌ Error extracting audio:', error);
    throw new Error(`Failed to extract audio: ${error.message}`);
  }
}

module.exports = { extractAudio };
