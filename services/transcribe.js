const fs = require('fs');
const axios = require('axios');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ASSEMBLYAI_BASE_URL = 'https://api.assemblyai.com/v2';
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_TIME_MS = 120000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadAudioToCloudinary(audioPath) {
  console.log('   ☁️ Uploading audio to Cloudinary for AssemblyAI...');

  try {
    const result = await cloudinary.uploader.upload(audioPath, {
      resource_type: 'video',
      folder: 'ai-transcriptions',
      public_id: `audio_${Date.now()}`,
      format: 'mp3'
    });

    console.log('   ✅ Audio uploaded to Cloudinary');
    console.log('   URL:', result.secure_url);

    return result.secure_url;
  } catch (error) {
    console.error('   ❌ Failed to upload audio to Cloudinary:', error.message);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
}

async function createTranscription(audioUrl, apiKey) {
  const response = await axios.post(
    `${ASSEMBLYAI_BASE_URL}/transcript`,
    { audio_url: audioUrl },
    {
      headers: {
        'authorization': apiKey,
        'content-type': 'application/json'
      },
      timeout: 30000
    }
  );

  return response.data.id;
}

async function pollForResult(transcriptId, apiKey) {
  console.log('   ⏳ Polling for transcription result...');

  const startTime = Date.now();

  while (Date.now() - startTime < MAX_POLL_TIME_MS) {
    try {
      const response = await axios.get(
        `${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`,
        {
          headers: { 'authorization': apiKey },
          timeout: 10000
        }
      );

      const result = response.data;

      if (result.status === 'completed') {
        console.log('   ✅ Transcription completed');
        return result;
      }

      if (result.status === 'error') {
        throw new Error(`AssemblyAI error: ${result.error}`);
      }

      console.log(`   Status: ${result.status}... waiting...`);
      await sleep(POLL_INTERVAL_MS);

    } catch (error) {
      console.error('   ❌ Polling error:', error.message);
      throw error;
    }
  }

  throw new Error('Transcription polling timed out after 2 minutes');
}

async function transcribeAudio(audioPath) {
  console.log('🎙️ Step 3: Transcribing audio with AssemblyAI...');
  console.log('   Audio file:', audioPath);

  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw new Error('ASSEMBLYAI_API_KEY is not configured');
  }

  let cloudinaryUrl;

  try {
    cloudinaryUrl = await uploadAudioToCloudinary(audioPath);

    console.log('   📡 Creating transcription task...');
    const transcriptId = await createTranscription(cloudinaryUrl, apiKey);
    console.log('   Transcript ID:', transcriptId);

    const result = await pollForResult(transcriptId, apiKey);

    console.log('   ✅ Transcription completed');
    console.log('   Duration:', (result.audio_duration || 0).toFixed(2), 'seconds');

    const words = result.words || [];
    console.log('   Words:', words.length);

    const segments = words.reduce((acc, word, idx, arr) => {
      if (idx === 0 || word.start - arr[idx - 1].end > 1) {
        acc.push({
          start: word.start,
          end: word.end,
          text: word.text
        });
      } else {
        const last = acc[acc.length - 1];
        last.end = word.end;
        last.text += ' ' + word.text;
      }
      return acc;
    }, []);

    return {
      text: result.text,
      duration: result.audio_duration,
      segments: segments
    };

  } catch (error) {
    console.error('❌ Transcription failed:', error.message);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

module.exports = { transcribeAudio };
