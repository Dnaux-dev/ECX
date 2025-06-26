const Joi = require('joi');

exports.applyToJob = {
  params: Joi.object({
    jobId: Joi.string().hex().length(24).required()
  })
  // File validation is handled by multer, but you can add more checks in the controller if needed
};

exports.updateStatus = {
  body: Joi.object({
    status: Joi.string().valid('pending', 'shortlisted', 'rejected', 'hired').required()
  })
}; 