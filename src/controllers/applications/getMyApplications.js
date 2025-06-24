const Application = require('../../models/Application');

module.exports = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.userId })
      .populate('job')
      .sort({ submittedAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications', details: err.message });
  }
}; 