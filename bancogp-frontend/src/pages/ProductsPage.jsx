import { useEffect, useState } from 'react';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout.jsx';
import { getAccountTypes, getCurrencies, getInterestRates, convertCurrency } from '../shared/api/productsApi.js';

export default function ProductsPage() {
  const [accountTypes, setAccountTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [interestRates, setInterestRates] = useState([]);
  const [conversion, setConversion] = useState(null);
  const [convertForm, setConvertForm] = useState({ from: 'USD', to: 'EUR', amount: 1 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAccountTypes().then((response) => setAccountTypes(response.accountTypes ?? [])).catch(() => {});
    getCurrencies().then((response) => setCurrencies(response.currencies ?? [])).catch(() => {});
    getInterestRates().then((response) => setInterestRates(response.interestRates ?? [])).catch(() => {});
  }, []);

  const handleConvert = async () => {
    setMessage('');
    try {
      const result = await convertCurrency(convertForm);
      setConversion(result);
    } catch {
      setMessage('No se pudo convertir la moneda.');
    }
  };

  return (
    <DashboardLayout title="Productos Financieros" subtitle="Administra cuentas, tasas e instrumentos bancarios.">
      <div className="section-grid">
        <section className="panel-card">
          <h2>Tipos de cuenta</h2>
          {accountTypes.length === 0 ? (
            <p>No hay tipos de cuenta disponibles.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {accountTypes.map((item) => (
                    <tr key={item.accountTypeId ?? item.id ?? item.typeId}>
                      <td>{item.accountTypeId ?? item.id ?? '-'}</td>
                      <td>{item.name ?? item.typeName ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel-card">
          <h2>Monedas y tasas</h2>
          {currencies.length === 0 && interestRates.length === 0 ? (
            <p>No hay datos de productos disponibles.</p>
          ) : (
            <>
              <div className="table-wrapper">
                <h3>Monedas</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Moneda</th>
                      <th>Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currencies.map((currency) => (
                      <tr key={currency.code ?? currency.currencyCode ?? currency.id}>
                        <td>{currency.code ?? currency.currencyCode ?? '-'}</td>
                        <td>{currency.name ?? currency.description ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-wrapper">
                <h3>Tasas de interés</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Cuenta</th>
                      <th>Tasa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interestRates.map((rate) => (
                      <tr key={rate.id ?? rate.accountTypeId ?? JSON.stringify(rate)}>
                        <td>{rate.accountType ?? rate.accountTypeId ?? '-'}</td>
                        <td>{rate.rate ? `${rate.rate}%` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="convert-card">
            <h3>Convertir moneda</h3>
            <div className="form-row">
              <input type="text" value={convertForm.from} onChange={(e) => setConvertForm((prev) => ({ ...prev, from: e.target.value }))} placeholder="Desde" />
              <input type="text" value={convertForm.to} onChange={(e) => setConvertForm((prev) => ({ ...prev, to: e.target.value }))} placeholder="Hacia" />
            </div>
            <div className="form-row">
              <input type="number" value={convertForm.amount} onChange={(e) => setConvertForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Cantidad" />
              <button className="btn btn--primary btn--small" onClick={handleConvert}>Convertir</button>
            </div>
            {message && <p className="error-text">{message}</p>}
            {conversion && (
              <div className="info-card">
                <p><strong>Resultado:</strong> {conversion.convertedAmount ?? conversion.amount ?? 0}</p>
                <p><strong>Moneda:</strong> {conversion.to ?? convertForm.to}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
