import { useEffect, useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomers, getCustomerAccounts } from '../shared/api/customersApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getCustomers()
      .then((response) => {
        setCustomers(response.customers ?? []);
      })
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleViewAccounts = async (customerId) => {
    setError('');
    setSelectedCustomer(customerId);
    try {
      const response = await getCustomerAccounts(customerId);
      setAccounts(response.accounts ?? []);
    } catch {
      setError('No se pudieron cargar las cuentas del cliente.');
      setAccounts([]);
    }
  };

  return (
    <DashboardLayout title="Clientes" subtitle="Administra la información de tus clientes bancarios.">
      <div className="section-grid">
        <section className="panel-card">
          <h2>Clientes</h2>
          {loading && <p>Cargando clientes...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && customers.length === 0 && <p>No hay clientes registrados aún.</p>}
          {customers.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customerId ?? customer.id ?? customer._id}>
                      <td>{customer.customerId ?? customer.id ?? customer._id}</td>
                      <td>{`${customer.firstName ?? customer.name ?? ''} ${customer.lastName ?? ''}`.trim()}</td>
                      <td>{customer.email ?? '-'}</td>
                      <td>
                        <button className="btn btn--secondary btn--small" onClick={() => handleViewAccounts(customer.customerId ?? customer.id ?? customer._id)}>
                          Ver cuentas
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel-card">
          <h2>Cuentas del cliente</h2>
          {selectedCustomer ? <p>Cliente seleccionado: {selectedCustomer}</p> : <p>Selecciona un cliente para ver sus cuentas.</p>}
          {accounts.length === 0 && <p>No hay cuentas disponibles para este cliente.</p>}
          {accounts.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.accountId ?? account.id ?? account.accountNumber}>
                      <td>{account.accountId ?? account.id ?? account.accountNumber}</td>
                      <td>{account.accountType ?? account.type ?? '-'}</td>
                      <td>{formatCurrency(account.balance ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
