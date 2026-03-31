const { exec } = require('child_process');
const fs = require('fs');

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('FFmpeg error:', stderr);
        return reject(new Error(stderr || error.message));
      }
      resolve(stdout);
    });
  });
}

function checkFFmpeg() {
  return new Promise((resolve, reject) => {
    exec('ffmpeg -version', (error) => {
      if (error) {
        console.error('FFmpeg not found!');
        reject(new Error('FFmpeg is not installed'));
      } else {
        console.log('✅ FFmpeg is available');
        resolve(true);
      }
    });
  });
}

module.exports = { execAsync, checkFFmpeg };
