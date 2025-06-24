const Application = require('../models/Application');
const Job = require('../models/Job');
const path = require('path');

exports.applyToJob = require('./applications/applyToJob');
exports.getMyApplications = require('./applications/getMyApplications');
exports.getApplicationsForJob = require('./applications/getApplicationsForJob');

// POST /apply/:jobId
exports.applyToJob = async (req, res) => {
  try {
    const applicantId = req.user.userId;
    const jobId = req.params.jobId;
    const resume = req.files?.resume?.[0];
    const coverLetter = req.files?.coverLetter?.[0];

    if (!resume) {
      return res.status(400).json({ error: 'Resume is required.' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({ applicant: applicantId, job: jobId });
    if (existing) {
      return res.status(409).json({ error: 'You have already applied to this job.' });
    }

    const application = new Application({
      applicant: applicantId,
      job: jobId,
      resumePath: resume.path,
      coverLetterPath: coverLetter ? coverLetter.path : undefined,
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit application', details: err.message });
  }
};

// GET /applications/mine (applicant only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job')
      .sort({ submittedAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err.message });
  }
};

// GET /applications/for-job/:jobId (employer only)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to view applications for this job' });
    }
    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'username')
      .sort({ submittedAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err.message });
  }
}; 