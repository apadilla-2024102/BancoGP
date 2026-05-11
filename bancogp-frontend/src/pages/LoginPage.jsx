import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore.jsx';
import { LoginForm } from '../features/auth/components/LoginForm.jsx';
import { useEffect } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (form) => {
    await login(form);
    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="login-page">
      <div className="login-page__background" />
      <div className="login-page__container">
        <section className="login-page__hero">
          <div className="login-page__brand">
            <span>Banco</span>
            <strong>GP</strong>
          </div>
          <div className="login-page__hero-copy">
            <p className="login-page__eyebrow">Bienvenido</p>
            <h1>Banco GP</h1>
          </div>
        </section>

        <section className="login-page__panel">
          <div className="login-page__panel-header">
            <div className="login-page__panel-logo-group">
              <img
                className="login-page__panel-logo"
                src="https://res.cloudinary.com/dbjg9o5oj/image/upload/v1771474381/bancogp_xjoycv.png"
                alt="BancoGP"
              />
              <div>
                <h2>Iniciar Sesión</h2>
              </div>
            </div>
            <div className="login-page__panel-badge">BancoGP</div>
          </div>

          <LoginForm onSubmit={handleSubmit} />
        </section>
      </div>
    </main>
  );
}
