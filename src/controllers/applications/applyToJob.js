const Application = require('../../models/Application');
const Job = require('../../models/Job');

module.exports = async (req, res) => {
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