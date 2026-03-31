const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadClip(clipPath, title, index) {
  console.log(`   ☁️ Uploading clip ${index} to Cloudinary...`);

  try {
    const result = await cloudinary.uploader.upload(clipPath, {
      resource_type: 'video',
      folder: 'ai-video-clips',
      public_id: `clip_${Date.now()}_${index}`,
      format: 'mp4',
      transformation: [
        { width: 1080, height: 1920, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    console.log(`   ✅ Clip ${index} uploaded successfully`);
    console.log(`   URL: ${result.secure_url}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration
    };

  } catch (error) {
    console.error(`   ❌ Error uploading clip ${index}:`, error.message);
    throw new Error(`Failed to upload clip ${index}: ${error.message}`);
  }
}

async function uploadClips(clips) {
  console.log('☁️ Step 6: Uploading clips to Cloudinary...');

  const uploadedClips = [];

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const uploadResult = await uploadClip(clip.path, clip.title, i + 1);

    uploadedClips.push({
      url: uploadResult.url,
      title: clip.title,
      start: clip.start,
      end: clip.end,
      duration: uploadResult.duration
    });
  }

  console.log('✅ All clips uploaded successfully');
  return uploadedClips;

}

module.exports = { uploadClips };
