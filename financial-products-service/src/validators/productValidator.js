const Joi = require('joi');

const accountTypeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  minimumBalance: Joi.number().min(0).required(),
  maximumBalance: Joi.number().min(0),
  monthlyFee: Joi.number().min(0)
});

const interestRateSchema = Joi.object({
  accountTypeId: Joi.string().required(),
  rate: Joi.number().positive().required(),
  effectiveFrom: Joi.date().required(),
  effectiveTo: Joi.date()
});

const currencySchema = Joi.object({
  code: Joi.string().length(3).required(),
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  exchangeRate: Joi.number().positive().required()
});

module.exports = {
  accountTypeSchema,
  interestRateSchema,
  currencySchema
};
