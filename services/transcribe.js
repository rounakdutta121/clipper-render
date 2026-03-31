const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

async function transcribeAudio(audioPath) {
  console.log('🎙️ Step 3: Transcribing audio with Whisper...');
  console.log('   Audio file:', audioPath);

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment']
    });

    console.log('✅ Transcription completed');
    console.log('   Duration:', transcription.duration?.toFixed(2), 'seconds');
    console.log('   Segments:', transcription.segments?.length || 0);

    return transcription;

  } catch (error) {
    console.error('❌ Error transcribing audio:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

module.exports = { transcribeAudio };
