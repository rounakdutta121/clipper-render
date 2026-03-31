const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/process-video';

async function testAPI(videoUrl) {
  console.log('🧪 Testing AI Video Clipper API...');
  console.log('URL:', API_URL);
  console.log('');

  try {
    console.log('📤 Sending request...');
    const startTime = Date.now();

    const response = await axios.post(API_URL, {
      videoUrl: videoUrl
    }, {
      timeout: 600000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('✅ Success!');
    console.log('⏱️ Duration:', duration, 'seconds');
    console.log('');
    console.log('📊 Response:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
    }
  }
}

const videoUrl = process.argv[2];

if (!videoUrl) {
  console.log('Usage: node test.js <video_url>');
  console.log('Example: node test.js https://example.com/video.mp4');
  process.exit(1);
}

testAPI(videoUrl);
