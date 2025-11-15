const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/parse-cv', require('./service/parse-cv'));
app.use('/analyze-job-desc', require('./service/analyze-job-desc'));
app.use('/transcribe-audio', require('./service/transcribe-audio'));
app.use('/tts-labs', require('./service/tts-elevenlabs'));
app.use('/generate-questions', require('./service/generate-questions'));
app.use('/delete-user-account', require('./service/delete-user-account'));
app.use('/analyze-response', require('./service/analyze-response'));
app.use('/generate-summary', require('./service/generate-summary'));

// Require the interview module once and mount its router
let interviewModule;
try {
  interviewModule = require('./service/interview-websocket');
  // If the module exports a router (default export), mount it
  if (interviewModule && typeof interviewModule === 'function') {
    app.use('/interview-websocket', interviewModule);
  } else if (interviewModule && interviewModule.router) {
    app.use('/interview-websocket', interviewModule.router);
  }
} catch (err) {
  console.warn('Optional interview-websocket module not found or failed to load:', err && err.message);
}

// If the interview module exposes setupWebSocketHandlers, create an HTTP server and init Socket.IO.
if (interviewModule && typeof interviewModule.setupWebSocketHandlers === 'function') {
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  });
  // Initialize socket handlers
  interviewModule.setupWebSocketHandlers(io);

  // Start HTTP server (required for Socket.IO)
  server.listen(port, () => {
    console.log(`Server (with WebSocket) is running at http://localhost:${port}`);
    console.log(`WebSocket namespace ready at ws://localhost:${port}/interview`);
  });
} else {
  // No socket integration required; use Express directly.
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}