const Joi = require('joi');

const registerCustomerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  documentType: Joi.string().required(),
  documentNumber: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required()
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
