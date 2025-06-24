const Joi = require('joi');

module.exports = (schema) => (req, res, next) => {
  if (!schema) return next();
  const validations = [];
  if (schema.body) validations.push(schema.body.validateAsync(req.body));
  if (schema.params) validations.push(schema.params.validateAsync(req.params));
  if (schema.query) validations.push(schema.query.validateAsync(req.query));
  Promise.allSettled(validations)
    .then(results => {
      const errors = results.filter(r => r.status === 'rejected').map(r => r.reason);
      if (errors.length) {
        return res.status(400).json({ error: 'Validation failed', details: errors.map(e => e.message) });
      }
      next();
    })
    .catch(err => res.status(400).json({ error: 'Validation error', details: err.message }));
}; 