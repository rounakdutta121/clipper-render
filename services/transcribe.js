const fs = require('fs');
const path = require('path');
const https = require('https');

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const TIMEOUT_MS = 120000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function transcribeAudio(audioPath) {
  console.log('🎙️ Step 3: Transcribing audio with Whisper...');
  console.log('   Audio file:', audioPath);

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`   🔄 Retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(RETRY_DELAY * (attempt - 1));
      }

      const result = await transcribeWithRetry(audioPath);
      
      console.log('✅ Transcription completed');
      console.log('   Duration:', result.duration?.toFixed(2), 'seconds');
      console.log('   Segments:', result.segments?.length || 0);

      return result;

    } catch (error) {
      lastError = error;
      console.error(`   ❌ Attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);

      if (attempt < MAX_RETRIES) {
        const isRetryable = 
          error.code === 'ECONNRESET' ||
          error.code === 'ETIMEDOUT' ||
          error.code === 'ECONNREFUSED' ||
          error.message?.includes('timeout') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('network');

        if (!isRetryable) {
          console.error('   ⚠️ Non-retryable error, stopping retries');
          break;
        }
      }
    }
  }

  console.error('❌ All transcription retries failed');
  throw new Error(`Failed to transcribe audio after ${MAX_RETRIES} attempts: ${lastError.message}`);
}

async function transcribeWithRetry(audioPath) {
  const { default: OpenAI } = await import('openai');
  
  const agent = new https.Agent({
    keepAlive: true,
    timeout: TIMEOUT_MS
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    httpAgent: agent,
    timeout: TIMEOUT_MS
  });

  const fileStream = fs.createReadStream(audioPath);

  const transcription = await openai.audio.transcriptions.create({
    file: fileStream,
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment']
  });

  return transcription;
}

module.exports = { transcribeAudio };
