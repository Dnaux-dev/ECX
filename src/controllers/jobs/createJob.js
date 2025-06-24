const Job = require('../../models/Job');

module.exports = async (req, res) => {
  try {
    // Create a new job using request body and set employer from authenticated user
    const job = new Job({
      ...req.body,
      employer: req.user.id // assuming req.user is set by auth middleware
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job', details: err.message });
  }
}; 