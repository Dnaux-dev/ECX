const express = require('express');
const auth = require('../middleware/auth');
const jobsController = require('../controllers/jobs');
const applicationsController = require('../controllers/applications');
const router = express.Router();

// Create a job (employer only)
router.post('/', auth('employer'), jobsController.createJob);

// Get all jobs (public) - with filtering, sorting, and pagination
router.get('/', jobsController.getJobs);

// Get a single job (public)
router.get('/:id', jobsController.getJob);

// Get applications for a specific job (employer only)
router.get('/:jobId/applications', auth('employer'), applicationsController.getApplicationsForJob);

// Update a job (employer only, only owner)
router.put('/:id', auth('employer'), jobsController.updateJob);

// Delete a job (employer only, only owner)
router.delete('/:id', auth('employer'), jobsController.deleteJob);

module.exports = router; 