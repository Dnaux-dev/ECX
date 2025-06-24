const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumePath: { type: String, required: true },
  coverLetterPath: { type: String },
  submittedAt: { type: Date, default: Date.now }
});

// Prevent duplicate applications by the same user to the same job
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 