const Joi = require('joi');

const registerCustomerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow('', null),
  documentType: Joi.string().optional().allow('', null),
  documentNumber: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  city: Joi.string().optional().allow('', null),
  country: Joi.string().optional().allow('', null)
});

const updateCustomerSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  country: Joi.string()
});

const createAccountSchema = Joi.object({
  customerId: Joi.string().required(),
  accountType: Joi.string().required(),
  initialBalance: Joi.number().min(0).required()
});

module.exports = {
  registerCustomerSchema,
  updateCustomerSchema,
  createAccountSchema
};
