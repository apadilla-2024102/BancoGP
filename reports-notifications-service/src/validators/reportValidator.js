const Joi = require('joi');

const accountStatementSchema = Joi.object({
  accountId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  format: Joi.string().valid('pdf', 'csv', 'json')
});

const notificationSchema = Joi.object({
  userId: Joi.string().required(),
  type: Joi.string().required(),
  message: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high')
});

module.exports = {
  accountStatementSchema,
  notificationSchema
};
