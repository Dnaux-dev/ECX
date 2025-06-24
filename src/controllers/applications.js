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

// GET /applications/mine (applicant only) - Enhanced with status tracking
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job', 'title company location salary jobType')
      .sort({ submittedAt: -1 });

    // Add metadata
    const totalApplications = applications.length;
    const statusCounts = {
      pending: applications.filter(app => app.status === 'pending').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length
    };

    res.json({
      success: true,
      data: {
        applications,
        metadata: {
          totalApplications,
          statusCounts
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err.message });
  }
};

// GET /applications/for-job/:jobId (employer only) - Enhanced with applicant details
exports.getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'username email')
      .sort({ submittedAt: -1 });

    // Add metadata
    const totalApplications = applications.length;
    const statusCounts = {
      pending: applications.filter(app => app.status === 'pending').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length
    };

    res.json({
      success: true,
      data: {
        job: {
          id: job._id,
          title: job.title,
          company: job.company
        },
        applications,
        metadata: {
          totalApplications,
          statusCounts
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err.message });
  }
};

// PUT /applications/:applicationId/status (employer only) - Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!['pending', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: pending, shortlisted, rejected, hired' });
    }

    const application = await Application.findById(applicationId)
      .populate('job', 'employer title');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.job.employer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: {
        application: {
          id: application._id,
          status: application.status,
          jobTitle: application.job.title
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application status', details: err.message });
  }
}; 