const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a job (employer only)
router.post('/', auth('employer'), async (req, res) => {
  const { title, description, location, salary, company } = req.body;
  try {
    const job = await Job.create({
      title,
      description,
      location,
      salary,
      company,
      employer: req.user.userId
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create job', details: err.message });
  }
});

// Get all jobs (public)
router.get('/', async (req, res) => {
  const jobs = await Job.find().populate('employer', 'username');
  res.json(jobs);
});

// Get a single job (public)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'username');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch {
    res.status(400).json({ error: 'Invalid job ID' });
  }
});

// Update a job (employer only, only owner)
router.put('/:id', auth('employer'), async (req, res) => {
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
});

// Delete a job (employer only, only owner)
router.delete('/:id', auth('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete job', details: err.message });
  }
});

module.exports = router; 