const { v4: uuidv4 } = require('uuid');

let localMode = false;

const customers = [
  {
    _id: uuidv4(),
    firstName: 'Carlos',
    lastName: 'Pérez',
    email: 'carlos.perez@example.com',
    phone: '+34111222333',
    documentType: 'DNI',
    documentNumber: '87654321B',
    address: 'Avenida Siempre Viva 742',
    city: 'Barcelona',
    country: 'España'
  },
  {
    _id: uuidv4(),
    firstName: 'Ana',
    lastName: 'Lopez',
    email: 'ana.lopez@example.com',
    phone: '+34199887766',
    documentType: 'Pasaporte',
    documentNumber: 'X1234567',
    address: 'Plaza Mayor 1',
    city: 'Sevilla',
    country: 'España'
  },
  {
    _id: uuidv4(),
    firstName: 'María',
    lastName: 'García',
    email: 'maria.garcia@example.com',
    phone: '+34123456789',
    documentType: 'DNI',
    documentNumber: '12345678A',
    address: 'Calle Falsa 123',
    city: 'Madrid',
    country: 'España'
  }
];

const accounts = [
  {
    _id: uuidv4(),
    accountNumber: '7373216334',
    customerId: customers[0]._id,
    accountType: 'Checking',
    balance: 25.4,
    currency: 'USD'
  },
  {
    _id: uuidv4(),
    accountNumber: '9161260807',
    customerId: customers[1]._id,
    accountType: 'Checking',
    balance: 89.18,
    currency: 'USD'
  }
];

function enableLocalMode() {
  localMode = true;
}

function isLocalMode() {
  return localMode;
}

function listCustomers() {
  return [...customers];
}

function findCustomerById(id) {
  return customers.find((c) => c._id === id) || null;
}

function findCustomerByEmail(email) {
  return customers.find((c) => c.email === email) || null;
}

function createCustomer(data) {
  const customer = {
    _id: uuidv4(),
    ...data
  };
  customers.push(customer);
  return customer;
}

function updateCustomer(id, updates) {
  const customer = findCustomerById(id);
  if (!customer) return null;
  Object.assign(customer, updates);
  return customer;
}

function listAccounts() {
  return [...accounts];
}

function findAccountByIdOrNumber(accountId) {
  let account = accounts.find((a) => a._id === accountId);
  if (!account) {
    account = accounts.find((a) => a.accountNumber === accountId);
  }
  return account || null;
}

function accountExistsByNumber(accountNumber) {
  return accounts.some((a) => a.accountNumber === accountNumber);
}

function listCustomerAccounts(customerId) {
  return accounts.filter((a) => a.customerId === customerId);
}

function createAccount({ customerId, accountType, balance, currency = 'USD' }) {
  const account = {
    _id: uuidv4(),
    accountNumber: generateAccountNumber(),
    customerId,
    accountType,
    balance: Number(balance) || 0,
    currency
  };
  accounts.push(account);
  return account;
}

function updateAccountBalance(accountId, delta) {
  const account = findAccountByIdOrNumber(accountId);
  if (!account) return null;
  account.balance = (account.balance || 0) + Number(delta);
  return account;
}

function generateAccountNumber() {
  let number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  while (accountExistsByNumber(number)) {
    number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  return number;
}

module.exports = {
  enableLocalMode,
  isLocalMode,
  listCustomers,
  findCustomerById,
  findCustomerByEmail,
  createCustomer,
  updateCustomer,
  listAccounts,
  findAccountByIdOrNumber,
  listCustomerAccounts,
  createAccount,
  updateAccountBalance
};
