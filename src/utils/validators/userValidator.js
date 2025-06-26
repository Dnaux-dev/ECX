const Joi = require('joi');

exports.register = {
  body: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('jobseeker', 'employer').required()
  })
};

exports.login = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
}; 