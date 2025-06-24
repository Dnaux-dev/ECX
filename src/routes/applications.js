const express = require('express');
const applicationsController = require('../controllers/applications');
const auth = require('../middleware/auth');
const upload = require('../config/multer');
const validate = require('../middleware/validate');
const { applyToJob } = require('../utils/validators/applicationValidator');

const router = express.Router();

// Apply to a job (applicant only)
router.post('/apply/:jobId',
  auth('jobseeker'),
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  validate(applyToJob),
  applicationsController.applyToJob
);

// View my applications (applicant only)
router.get('/mine', auth('jobseeker'), applicationsController.getMyApplications);

// View applications for a job (employer only)
router.get('/for-job/:jobId', auth('employer'), applicationsController.getApplicationsForJob);

module.exports = router; 