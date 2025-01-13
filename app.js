const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static('uploads')); // Serve static files from /uploads
app.use(express.urlencoded({ extended: true })); // Parse form data

// Multer Configuration
const upload = multer({
  dest: 'uploads/', // Save uploaded files to /uploads directory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Route to render the upload form
// app.get('/', (req, res) => {
//   // Render the index.ejs file with default values for message and imagePath
// });
app.get('/', (req, res) => {
    res.render('index', { message: null, imagePath: null });
  // res.sendFile(path.join(__dirname, 'public', 'Speedtest by Ookla - The Global Broadband Speed Test.html'));
});

// Route to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  // Render the index.ejs file with a success message and the uploaded image's path
  res.render('error', {
    message: 'File uploaded successfully!',
    imagePath: `/${file.filename}`,
  });
});

// Admin panel route
app.get('/admin', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading upload directory');
    }

    res.render('admin', { files });
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
