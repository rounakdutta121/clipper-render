const path = require('path');
const { execAsync } = require('../utils/ffmpeg');

async function generateClips(videoPath, segments, outputDir) {
  console.log('✂️ Step 5: Generating clips from segments...');
  console.log('   Segments to process:', segments.length);

  const clips = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const clipPath = path.join(outputDir, `clip_${i + 1}.mp4`);

    console.log(`   Processing clip ${i + 1}/${segments.length}...`);
    console.log(`   [${segment.start.toFixed(1)}s - ${segment.end.toFixed(1)}s]`);

    try {
      await execAsync(
        `ffmpeg -ss ${segment.start} -i "${videoPath}" -t ${segment.end - segment.start} ` +
        `-vf "crop=ih*9/16:ih" -c:v libx264 -preset fast -crf 23 ` +
        `-c:a aac -b:a 128k -y "${clipPath}"`
      );

      const clipInfo = {
        index: i + 1,
        path: clipPath,
        start: segment.start,
        end: segment.end,
        title: segment.title
      };

      clips.push(clipInfo);
      console.log(`   ✅ Clip ${i + 1} created successfully`);

    } catch (error) {
      console.error(`   ❌ Error creating clip ${i + 1}:`, error.message);
      throw new Error(`Failed to generate clip ${i + 1}: ${error.message}`);
    }
  }

  console.log('✅ All clips generated successfully');
  return clips;

}

module.exports = { generateClips };
