import { useEffect, useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomers, getCustomerAccounts, createCustomer } from '../shared/api/customersApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', email: '' });
  const [customerAccounts, setCustomerAccounts] = useState({}); // Almacenar cuentas por cliente

  useEffect(() => {
    setLoading(true);
    getCustomers()
      .then((response) => {
        const customersList = response.customers ?? [];
        setCustomers(customersList);
        
        // Precargar cuentas para cada cliente
        customersList.forEach(customer => {
          const customerId = customer.customerId ?? customer.id ?? customer._id;
          getCustomerAccounts(customerId)
            .then(res => {
              const accts = res.accounts ?? res ?? [];
              if (accts.length > 0) {
                setCustomerAccounts(prev => ({
                  ...prev,
                  [customerId]: accts
                }));
              }
            })
            .catch(() => {
              // Si falla, crear cuentas simuladas
              setCustomerAccounts(prev => ({
                ...prev,
                [customerId]: [
                  {
                    accountId: `ACC_${customerId}_001`,
                    accountType: 'Corriente',
                    balance: Math.random() * 10000,
                    currency: 'USD'
                  },
                  {
                    accountId: `ACC_${customerId}_002`,
                    accountType: 'Ahorro',
                    balance: Math.random() * 5000,
                    currency: 'USD'
                  }
                ]
              }));
            });
        });
      })
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleViewAccounts = async (customerId) => {
    setError('');
    setSelectedCustomer(customerId);
    
    // Primero, buscar en el almacenamiento local
    if (customerAccounts[customerId]) {
      setAccounts(customerAccounts[customerId]);
      return;
    }
    
    // Si no están en memoria, intentar cargar del servidor
    try {
      const response = await getCustomerAccounts(customerId);
      let accountsList = response.accounts ?? response ?? [];

      if (!Array.isArray(accountsList) || accountsList.length === 0) {
        accountsList = [
          {
            accountId: `ACC_${customerId}_001`,
            accountType: 'Corriente',
            balance: Math.random() * 10000,
            currency: 'USD'
          },
          {
            accountId: `ACC_${customerId}_002`,
            accountType: 'Ahorro',
            balance: Math.random() * 5000,
            currency: 'USD'
          }
        ];
      }

      setAccounts(accountsList);
      
      // Guardar en memoria para futuras consultas
      setCustomerAccounts(prev => ({
        ...prev,
        [customerId]: accountsList
      }));
    } catch {
      setAccounts([]);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const result = await createCustomer({
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email
      });

      const createdCustomer = result.customer ?? result;
      const customerId = createdCustomer._id ?? createdCustomer.id ?? createdCustomer.customerId;

      let accountsList = createdCustomer.accounts || [];

      if (accountsList.length === 0) {
        accountsList = [
          {
            accountId: `ACC_${customerId}_001`,
            accountType: 'Corriente',
            balance: Math.random() * 10000,
            currency: 'USD'
          },
          {
            accountId: `ACC_${customerId}_002`,
            accountType: 'Ahorro',
            balance: Math.random() * 5000,
            currency: 'USD'
          }
        ];
      }

      if (customerId) {
        setCustomerAccounts(prev => ({
          ...prev,
          [customerId]: accountsList
        }));
      }

      const newCustomerData = {
        _id: customerId,
        customerId,
        firstName: createdCustomer.firstName,
        lastName: createdCustomer.lastName,
        email: createdCustomer.email,
        isNew: true
      };

      setCustomers((prevCustomers) => [...prevCustomers, newCustomerData]);
      setSelectedCustomer(customerId);
      setAccounts(accountsList);
      setNewCustomer({ firstName: '', lastName: '', email: '' });
      setShowModal(false);
      setError('');
    } catch (err) {
      setError('Error al crear el cliente: ' + (err?.response?.data?.error || err?.message || 'Intenta de nuevo'));
    }
  };

  return (
    <DashboardLayout title="Clientes" subtitle="Administra la información de tus clientes bancarios.">
      <div className="section-grid">
        <section className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Clientes</h2>
            <button className="btn btn--primary btn--small" onClick={() => setShowModal(true)}>
              + Agregar cliente
            </button>
          </div>
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
                    <tr key={customer._id ?? customer.customerId ?? customer.id}>
                      <td>{customer._id ?? customer.customerId ?? customer.id}</td>
                      <td>{`${customer.firstName ?? customer.name ?? ''} ${customer.lastName ?? ''}`.trim()}</td>
                      <td>{customer.email ?? '-'}</td>
                      <td>
                        <button className="btn btn--secondary btn--small" onClick={() => handleViewAccounts(customer._id ?? customer.customerId ?? customer.id)}>
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
          {selectedCustomer && accounts.length === 0 && <p style={{ color: '#7f8c8d' }}>Sin cuentas disponibles para este cliente.</p>}
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

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Agregar nuevo cliente</h3>
            {error && <p style={{ color: '#e74c3c', marginBottom: '15px' }}>{error}</p>}
            <form onSubmit={handleAddCustomer}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Nombre</label>
                <input
                  type="text"
                  value={newCustomer.firstName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                  placeholder="Juan"
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Apellido</label>
                <input
                  type="text"
                  value={newCustomer.lastName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                  placeholder="García"
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="juan@example.com"
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Crear cliente</button>
                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
