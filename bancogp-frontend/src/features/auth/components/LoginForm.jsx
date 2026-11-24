import { useMemo, useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { Button, Input } from '../../../shared/components/ui/index.js';

export const LoginForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => form.email.trim() !== '' && form.password.trim() !== '', [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      setError('');
      await onSubmit(form);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'No pudimos iniciar sesión. Revisa tus datos.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form-v2" onSubmit={handleSubmit} noValidate>
      <Input
        label="Correo o usuario"
        name="email"
        type="text"
        autoComplete="username"
        value={form.email}
        onChange={handleChange}
        placeholder="hola@bancogp.com"
        icon={<FiUser />}
        required
      />
      <Input
        label="Contraseña"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={<FiLock />}
        suffix={
          <button
            type="button"
            className="input__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        }
        required
      />

      {error && (
        <div className="alert alert--danger" role="alert">
          <FiAlertCircle aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="button--block" disabled={!canSubmit} loading={submitting}>
        Iniciar sesión
      </Button>
    </form>
  );
};
