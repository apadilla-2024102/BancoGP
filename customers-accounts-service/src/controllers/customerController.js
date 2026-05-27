const Customer = require('../models/customer');

const customerController = {
  registerCustomer: async (req, res, next) => {
    try {
      const data = req.body;
      const existing = await Customer.findOne({ email: data.email });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      const customer = new Customer(data);
      await customer.save();
      res.status(201).json({ message: 'Customer registered successfully', customer });
    } catch (error) {
      next(error);
    }
  },

  getCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const customer = await Customer.findById(customerId).lean();
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  },

  updateCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const updates = req.body;
      const customer = await Customer.findByIdAndUpdate(customerId, updates, { new: true }).lean();
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (error) {
      next(error);
    }
  },

  listCustomers: async (req, res, next) => {
    try {
      const customers = await Customer.find().lean();
      res.status(200).json({ customers });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
