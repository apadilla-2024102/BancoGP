const Joi = require('joi');

const depositSchema = Joi.object({
  accountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string()
});

const withdrawalSchema = Joi.object({
  accountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string()
});

const transferSchema = Joi.object({
  fromAccountId: Joi.string().required(),
  toAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string()
});

module.exports = {
  depositSchema,
  withdrawalSchema,
  transferSchema
};
