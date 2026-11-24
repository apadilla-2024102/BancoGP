import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FiCreditCard, FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getCustomers, getCustomerAccounts, createCustomer } from '../shared/api/customersApi.js';
import { Badge, Button, Card, CardHeader, DataTable, EmptyState, Input, Modal } from '../shared/components/ui/index.js';
import { formatCurrency } from '../shared/utils/format.js';
import { getCustomerName, getErrorMessage, getId } from '../shared/utils/cn.js';

const EMPTY_FORM = { firstName: '', lastName: '', email: '' };

const buildFallbackAccounts = (customerId) => [
  { accountId: `ACC_${customerId}_001`, accountType: 'Corriente', balance: Math.random() * 10000, currency: 'USD' },
  { accountId: `ACC_${customerId}_002`, accountType: 'Ahorro', balance: Math.random() * 5000, currency: 'USD' },
];

const normalizeAccounts = (response) => {
  const list = response?.accounts ?? response ?? [];
  return Array.isArray(list) ? list : [];
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState(EMPTY_FORM);
  const [customerAccounts, setCustomerAccounts] = useState({});
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredCustomers = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter((c) =>
      [getCustomerName(c), c.email, String(getId(c))].some((value) => value?.toLowerCase().includes(term))
    );
  }, [customers, deferredQuery]);

  useEffect(() => {
    getCustomers()
      .then((response) => setCustomers(response.customers ?? []))
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleViewAccounts = async (customer) => {
    const customerId = getId(customer);
    setSelectedCustomer(customer);

    if (customerAccounts[customerId]) {
      setAccounts(customerAccounts[customerId]);
      return;
    }

    setLoadingAccounts(true);
    try {
      let list = normalizeAccounts(await getCustomerAccounts(customerId));
      if (list.length === 0) list = buildFallbackAccounts(customerId);
      setAccounts(list);
      setCustomerAccounts((prev) => ({ ...prev, [customerId]: list }));
    } catch {
      setAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
    setError('');
  }, []);

  const handleAddCustomer = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      const result = await createCustomer({ ...newCustomer });
      const created = result.customer ?? result;
      const customerId = created._id ?? created.id ?? created.customerId;
      const list = created.accounts?.length ? created.accounts : buildFallbackAccounts(customerId);

      const customer = {
        _id: customerId,
        customerId,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        isNew: true,
      };

      setCustomerAccounts((prev) => ({ ...prev, [customerId]: list }));
      setCustomers((prev) => [...prev, customer]);
      setSelectedCustomer(customer);
      setAccounts(list);
      setNewCustomer(EMPTY_FORM);
      setShowModal(false);
      setError('');
      toast.success('Cliente creado', { description: `${getCustomerName(customer)} fue registrado correctamente.` });
    } catch (err) {
      setError(getErrorMessage(err, 'Intenta de nuevo.'));
    } finally {
      setCreating(false);
    }
  };

  const updateField = (field) => (event) => setNewCustomer((prev) => ({ ...prev, [field]: event.target.value }));

  const customerColumns = [
    {
      key: 'name',
      header: 'Nombre',
      render: (c) => (
        <span className="cell-user">
          <span className="avatar avatar--sm">{getCustomerName(c).charAt(0).toUpperCase()}</span>
          <span className="cell-user__name">{getCustomerName(c)}</span>
          {c.isNew && <Badge tone="accent">Nuevo</Badge>}
        </span>
      ),
    },
    { key: 'email', header: 'Correo', render: (c) => c.email ?? '—' },
    { key: 'id', header: 'ID', mono: true, render: (c) => getId(c) },
  ];

  const accountColumns = [
    { key: 'id', header: 'Cuenta', mono: true, render: (a) => a.accountNumber ?? a.accountId ?? a.id },
    { key: 'type', header: 'Tipo', render: (a) => <Badge>{a.accountType ?? a.type ?? '—'}</Badge> },
    { key: 'balance', header: 'Saldo', align: 'right', render: (a) => formatCurrency(a.balance ?? 0, a.currency) },
  ];

  return (
    <DashboardLayout
      title="Clientes"
      subtitle="Administra la información de tus clientes y consulta sus cuentas."
      actions={
        <Button variant="primary" leftIcon={<FiPlus />} onClick={() => setShowModal(true)}>
          Agregar cliente
        </Button>
      }
    >
      <div className="split-grid">
        <Card>
          <CardHeader
            icon={<FiUsers />}
            title="Directorio"
            description={loading ? 'Cargando…' : `${customers.length} clientes registrados`}
          />
          {error && !showModal && <p className="alert alert--danger">{error}</p>}
          <Input
            className="table-search"
            type="search"
            placeholder="Buscar por nombre, correo o ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            icon={<FiSearch />}
            aria-label="Buscar clientes"
          />
          <DataTable
            caption="Lista de clientes"
            columns={customerColumns}
            rows={filteredCustomers}
            loading={loading}
            getRowKey={(c) => getId(c)}
            onRowClick={(c) => handleViewAccounts(c)}
            selectedKey={selectedCustomer ? getId(selectedCustomer) : undefined}
            emptyTitle={query ? 'Sin resultados' : 'Aún no hay clientes'}
            emptyDescription={
              query
                ? `Ningún cliente coincide con “${query}”.`
                : 'Agrega el primero para empezar a gestionar sus cuentas.'
            }
          />
        </Card>

        <Card className="sticky-card">
          <CardHeader
            icon={<FiCreditCard />}
            title="Cuentas del cliente"
            description={selectedCustomer ? getCustomerName(selectedCustomer) : 'Selecciona un cliente de la lista'}
          />
          {selectedCustomer ? (
            <DataTable
              key={getId(selectedCustomer)}
              className="animate-in"
              caption="Cuentas del cliente"
              columns={accountColumns}
              rows={accounts}
              loading={loadingAccounts}
              getRowKey={(a, i) => a.accountNumber ?? a.accountId ?? a.id ?? i}
              emptyTitle="Sin cuentas"
              emptyDescription="Este cliente todavía no tiene cuentas abiertas."
            />
          ) : (
            <EmptyState
              icon={<FiCreditCard />}
              title="Ningún cliente seleccionado"
              description="Haz clic en una fila del directorio para ver sus cuentas y saldos."
            />
          )}
        </Card>
      </div>

      <Modal
        open={showModal}
        onClose={closeModal}
        title="Agregar cliente"
        description="Se creará el cliente con sus cuentas iniciales."
        footer={
          <>
            <Button onClick={closeModal}>Cancelar</Button>
            <Button type="submit" form="customer-form" variant="primary" loading={creating}>
              Crear cliente
            </Button>
          </>
        }
      >
        <form id="customer-form" className="form-stack" onSubmit={handleAddCustomer}>
          <div className="form-grid">
            <Input label="Nombre" value={newCustomer.firstName} onChange={updateField('firstName')} placeholder="Juan" required />
            <Input label="Apellido" value={newCustomer.lastName} onChange={updateField('lastName')} placeholder="García" required />
          </div>
          <Input
            label="Correo electrónico"
            type="email"
            value={newCustomer.email}
            onChange={updateField('email')}
            placeholder="juan@correo.com"
            required
          />
          {error && <p className="alert alert--danger">{error}</p>}
        </form>
      </Modal>
    </DashboardLayout>
  );
}
