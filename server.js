require('dotenv').config();
const express = require('express');
const processVideoRoutes = require('./routes/processVideo');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    status: 'Server running',
    message: 'AI Video Clipper API is active',
    endpoint: 'POST /process-video'
  });
});

app.use('/process-video', processVideoRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI Video Clipper server running on port ${PORT}`);
  console.log(`📁 Working directory: ${process.cwd()}`);
});
