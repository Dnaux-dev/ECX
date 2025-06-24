const Job = require('../../models/Job');

module.exports = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if the authenticated user is the owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job', details: err.message });
  }
}; 