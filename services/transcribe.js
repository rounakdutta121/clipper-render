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

async function uploadAudioToAssemblyAI(audioPath, apiKey) {
  console.log('   📤 Uploading audio directly to AssemblyAI...');

  try {
    const fileStream = fs.createReadStream(audioPath);
    const stats = fs.statSync(audioPath);
    const fileSize = stats.size;

    const response = await axios.post(
      `${ASSEMBLYAI_BASE_URL}/upload`,
      fileStream,
      {
        headers: {
          'authorization': apiKey,
          'content-type': 'application/octet-stream'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000
      }
    );

    console.log('   ✅ Audio uploaded to AssemblyAI');
    console.log('   Upload URL:', response.data.upload_url);

    return response.data.upload_url;
  } catch (error) {
    if (error.response) {
      console.error('   ❌ Upload failed:', error.response.data);
      throw new Error(`AssemblyAI upload error: ${JSON.stringify(error.response.data)}`);
    }
    console.error('   ❌ Upload failed:', error.message);
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
}

async function createTranscription(audioUrl, apiKey) {
  console.log('   📡 Creating transcription task...');
  console.log('   Audio URL:', audioUrl);

  try {
    const response = await axios.post(
      `${ASSEMBLYAI_BASE_URL}/transcript`,
      { 
        audio_url: audioUrl,
        speech_models: ['universal-3-pro']
      },
      {
        headers: {
          'authorization': apiKey,
          'content-type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('   ✅ Transcription task created');
    return response.data.id;
  } catch (error) {
    if (error.response) {
      console.error('   ❌ AssemblyAI Error:', JSON.stringify(error.response.data));
      throw new Error(`AssemblyAI error: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
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

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      console.log(`   Status: ${result.status}... (${elapsed}s elapsed)`);
      await sleep(POLL_INTERVAL_MS);

    } catch (error) {
      console.error('   ❌ Polling error:', error.message);
      throw error;
    }
  }

  throw new Error('Transcription polling timed out after 2 minutes');
}

function buildSegmentsFromWords(words) {
  if (!words || words.length === 0) return [];

  const segments = [];
  let currentSegment = null;

  for (const word of words) {
    if (!currentSegment) {
      currentSegment = {
        start: word.start / 1000,
        end: word.end / 1000,
        text: word.text
      };
    } else if (word.start / 1000 - currentSegment.end < 1) {
      currentSegment.end = word.end / 1000;
      currentSegment.text += ' ' + word.text;
    } else {
      segments.push(currentSegment);
      currentSegment = {
        start: word.start / 1000,
        end: word.end / 1000,
        text: word.text
      };
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

async function transcribeAudio(audioPath) {
  console.log('🎙️ Step 3: Transcribing audio with AssemblyAI...');
  console.log('   Audio file:', audioPath);

  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw new Error('ASSEMBLYAI_API_KEY is not configured');
  }

  try {
    const uploadUrl = await uploadAudioToAssemblyAI(audioPath, apiKey);
    const transcriptId = await createTranscription(uploadUrl, apiKey);
    console.log('   Transcript ID:', transcriptId);

    const result = await pollForResult(transcriptId, apiKey);

    console.log('   ✅ Transcription completed');
    console.log('   Duration:', (result.audio_duration || 0).toFixed(2), 'seconds');

    const words = result.words || [];
    console.log('   Words:', words.length);

    const segments = buildSegmentsFromWords(words);

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
