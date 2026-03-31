const OpenAI = require('openai');

async function analyzeTranscript(transcription) {
  console.log('🧠 Step 4: Analyzing transcript with GPT...');
  console.log('   Segments:', transcription.segments?.length || 0);

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const segments = transcription.segments || [];
    const transcriptText = segments.map(seg => 
      `[${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s]: ${seg.text}`
    ).join('\n');

    const prompt = `You are an expert content analyst specializing in creating viral short-form content for platforms like TikTok, Instagram Reels, and YouTube Shorts.

Analyze the following video transcript and identify the most engaging, impactful moments that would make great standalone clips.

Look for:
- High-energy moments or emotional peaks
- Key insights or valuable tips
- Memorable quotes or statements
- Controversial or thought-provoking points
- Actionable advice or steps
- Funny or entertaining segments
- Surprising revelations or facts

Return ONLY a valid JSON array of objects with this exact format (no markdown, no code blocks, just pure JSON):
[
  {
    "start": number,
    "end": number,
    "title": "string describing this moment in 5-10 words"
  }
]

Return 3-5 of the most engaging segments. Each segment should be between 15-60 seconds long for optimal short-form content.

Transcript:
${transcriptText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at identifying engaging content moments for short-form video. Always return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let gptResponse = response.choices[0].message.content.trim();
    
    gptResponse = gptResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    let segments_data;
    try {
      segments_data = JSON.parse(gptResponse);
    } catch (parseError) {
      console.error('⚠️ Failed to parse GPT response, attempting retry...');
      
      const jsonMatch = gptResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        segments_data = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse GPT response as JSON');
      }
    }

    if (!Array.isArray(segments_data)) {
      throw new Error('GPT response is not an array');
    }

    console.log('✅ Transcript analysis completed');
    console.log('   Identified segments:', segments_data.length);

    return segments_data;

  } catch (error) {
    console.error('❌ Error analyzing transcript:', error);
    throw new Error(`Failed to analyze transcript: ${error.message}`);
  }
}

module.exports = { analyzeTranscript };
