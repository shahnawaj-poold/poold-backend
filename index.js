const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/parse-cv', require('./service/parse-cv'));
app.use('/analyze-job-desc', require('./service/analyze-job-desc'));
// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});