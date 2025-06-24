const Application = require('../../models/Application');
const Job = require('../../models/Job');

module.exports = async (req, res) => {
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