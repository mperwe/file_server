// server.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const PORT = 4000;
const PASSWORD = 'pass12345'; // Hardcoded passwd

app.use(morgan('dev')); // Morgan to log requests
app.use(express.urlencoded({ extended: true })); // To parse form data

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to protect the /node-course route
app.use('/node-course', (req, res, next) => {
  const password = req.query.password;
  if (password === PASSWORD) {
    next();
  } else {
    res.redirect('/login');
  }
});

// Route for login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.redirect(`/node-course?password=${PASSWORD}`);
  } else {
    res.send('Incorrect password. Please try again.');
  }
});

// Route for node-course page
app.get('/node-course', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'node-course.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
