const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  company: { type: String, required: true },
  jobType: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract']
  },
  createdAt: { type: Date, default: Date.now },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Job', jobSchema); 