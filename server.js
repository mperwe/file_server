const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const app = express();

const PORT = 4500;
const PASSWORD = 'pass12345'; // Hardcoded password

app.use(morgan('dev')); // Morgan to log requests
app.use(express.urlencoded({ extended: true })); // To parse form data

// Set up session middleware
app.use(session({
  secret: 'pass12345', // secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 } // 1 minute session expiration for demonstration
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to protect the /node-course route
app.use('/node-course', (req, res, next) => {
  if (req.session.isAuthenticated) {
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
    req.session.isAuthenticated = true;
    res.redirect('/node-course');
  } else {
    res.send('Incorrect password. Please try again.');
  }
});

// Route for node-course page
app.get('/node-course', (req, res) => {
  if (req.session.isAuthenticated) {
    res.sendFile(path.join(__dirname, 'public', 'node-course.html'));
  } else {
    res.redirect('/login');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
