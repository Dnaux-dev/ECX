const Job = require('../../models/Job');

module.exports = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'username');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch {
    res.status(400).json({ error: 'Invalid job ID' });
  }
}; 