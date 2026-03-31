const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function downloadVideo(videoUrl, outputPath) {
  console.log('📥 Step 1: Downloading video...');
  console.log('   URL:', videoUrl);

  try {
    await fs.ensureDir(path.dirname(outputPath));

    const response = await axios({
      method: 'get',
      url: videoUrl,
      responseType: 'stream',
      timeout: 300000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const writer = fs.createWriteStream(outputPath);
    
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log('✅ Video downloaded successfully');
        console.log('   Size:', fileSizeMB, 'MB');
        console.log('   Path:', outputPath);
        resolve(outputPath);
      });
      
      writer.on('error', (error) => {
        console.error('❌ Error writing video file:', error);
        reject(error);
      });
    });

  } catch (error) {
    console.error('❌ Error downloading video:', error.message);
    throw new Error(`Failed to download video: ${error.message}`);
  }
}

module.exports = { downloadVideo };
