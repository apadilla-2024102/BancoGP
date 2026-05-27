const mongoose = require('mongoose');
const Customer = require('../src/models/customer');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/banco_clientes?authSource=admin';

const sample = [
  {
    firstName: 'María',
    lastName: 'García',
    email: 'maria.garcia@example.com',
    phone: '+34123456789',
    documentType: 'DNI',
    documentNumber: '12345678A',
    address: 'Calle Falsa 123',
    city: 'Madrid',
    country: 'España'
  },
  {
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
    firstName: 'Ana',
    lastName: 'Lopez',
    email: 'ana.lopez@example.com',
    phone: '+34199887766',
    documentType: 'Pasaporte',
    documentNumber: 'X1234567',
    address: 'Plaza Mayor 1',
    city: 'Sevilla',
    country: 'España'
  }
];

async function run() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');
  await Customer.deleteMany({});
  const inserted = await Customer.insertMany(sample);
  console.log('Inserted customers:', inserted.map(c => c.email));
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
