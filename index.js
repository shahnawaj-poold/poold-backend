const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/parse-cv', require('./service/parse-cv'));
app.use('/analyze-job-desc', require('./service/analyze-job-desc'));
app.use('/transcribe-audio', require('./service/transcribe-audio'));
app.use('/tts-elevenlabs', require('./service/tts-elevenlabs'));
// Alias for the quick test page which posts to /tts-labs
app.use('/tts-labs', require('./service/tts-elevenlabs'));
// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});