const Joi = require('joi');

exports.createJob = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    salary: Joi.number().required(),
    company: Joi.string().required(),
    jobType: Joi.string().valid('full-time', 'part-time', 'contract').required()
  })
};

exports.updateJob = {
  body: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    salary: Joi.number(),
    company: Joi.string(),
    jobType: Joi.string().valid('full-time', 'part-time', 'contract')
  })
}; 