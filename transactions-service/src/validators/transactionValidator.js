const Joi = require('joi');

const depositSchema = Joi.object({
  accountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
});

const withdrawalSchema = Joi.object({
  accountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
});

const transferSchema = Joi.object({
  fromAccountId: Joi.string().required(),
  toAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().optional()
}).custom((value, helpers) => {
  if (value.fromAccountId === value.toAccountId) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'transfer validation').messages({
  'any.invalid': 'fromAccountId and toAccountId must be different'
});

module.exports = {
  depositSchema,
  withdrawalSchema,
  transferSchema
};
