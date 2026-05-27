const mongoose = require('mongoose');
const Account = require('../src/models/account');
const Customer = require('../src/models/customer');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/banco_clientes?authSource=admin';

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for account seeding');

  const customers = await Customer.find().limit(10);
  if (customers.length === 0) {
    console.log('No customers found to create accounts for');
    await mongoose.disconnect();
    return;
  }

  const accounts = [];
  for (const c of customers) {
    const accNum = generateAccountNumber();
    const acc = new Account({
      accountNumber: accNum,
      customerId: c._id,
      accountType: 'Checking',
      balance: Math.floor(Math.random() * 10000) / 100
    });
    accounts.push(acc);
  }

  await Account.insertMany(accounts);
  console.log('Inserted accounts for customers:', customers.map(c => c.email));
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
