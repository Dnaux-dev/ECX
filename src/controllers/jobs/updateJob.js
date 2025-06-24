const Job = require('../../models/Job');

module.exports = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this job' });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update job', details: err.message });
  }
}; 