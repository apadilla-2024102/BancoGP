import { useMemo, useState } from 'react';

export const LoginForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const canSubmit = useMemo(
    () => form.email.trim() !== '' && form.password.trim() !== '',
    [form]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await onSubmit(form);
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__field">
        <label htmlFor="email">Correo o usuario</label>
        <input
          id="email"
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          placeholder="hola@bancogp.com o usuario"
          required
        />
      </div>
      <div className="login-form__field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="********"
          required
        />
      </div>
      {error && <p className="login-form__error">{error}</p>}
      <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
        Iniciar sesión
      </button>
    </form>
  );
};
