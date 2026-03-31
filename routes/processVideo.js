const express = require('express');
const router = express.Router();
const { processVideo } = require('../services/processVideo');

router.post('/', async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'videoUrl is required'
      });
    }

    console.log('🎬 Starting video processing:', videoUrl);

    const result = await processVideo(videoUrl);

    console.log('✅ Video processing completed successfully');
    res.json(result);

  } catch (error) {
    console.error('❌ Error processing video:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process video'
    });
  }
});

module.exports = router;
