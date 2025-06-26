const express = require('express');
const auth = require('../middleware/auth');
const jobsController = require('../controllers/jobs');
const applicationsController = require('../controllers/applications');
const validate = require('../middleware/validate');
const { createJob, updateJob } = require('../utils/validators/jobValidator');
const router = express.Router();

// Create a job (employer only)
router.post('/', auth('employer'), validate(createJob), jobsController.createJob);

// Get all jobs (public) - with filtering, sorting, and pagination
router.get('/', jobsController.getJobs);

// Get a single job (public)
router.get('/:id', jobsController.getJob);

// Get applications for a specific job (employer only)
router.get('/:jobId/applications', auth('employer'), applicationsController.getApplicationsForJob);

// Update a job (employer only, only owner)
router.put('/:id', auth('employer'), validate(updateJob), jobsController.updateJob);

// Delete a job (employer only, only owner)
router.delete('/:id', auth('employer'), jobsController.deleteJob);

module.exports = router; 