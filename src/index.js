const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Job routes
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

// Applications routes
const applicationsRoutes = require('./routes/applications');
app.use('/applications', applicationsRoutes);

// Direct route for my-applications (applicant only)
const auth = require('./middleware/auth');
const applicationsController = require('./controllers/applications');
app.get('/my-applications', auth('jobseeker'), applicationsController.getMyApplications);

// JWT middleware example
app.get('/api/private', auth(), (req, res) => {
  res.json({ message: `Hello, ${req.user.role}!` });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Job Board API with ATS System' });
});

// Centralized error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 