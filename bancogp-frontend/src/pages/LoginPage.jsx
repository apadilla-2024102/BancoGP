import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FiShield, FiZap, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../store/authStore.jsx';
import { LoginForm } from '../features/auth/components/LoginForm.jsx';
import { DotPattern, ThemeToggle } from '../shared/components/ui/index.js';
import { Brand } from '../shared/components/layout/Sidebar.jsx';

const LOGO_URL = 'https://res.cloudinary.com/dbjg9o5oj/image/upload/v1771474381/bancogp_xjoycv.png';

const FEATURES = [
  { icon: FiShield, title: 'Seguro por diseño', text: 'Autenticación con tokens y sesiones protegidas.' },
  { icon: FiZap, title: 'Operaciones al instante', text: 'Depósitos, retiros y transferencias en segundos.' },
  { icon: FiTrendingUp, title: 'Reportes claros', text: 'Estadísticas y estados de cuenta en un solo lugar.' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  const handleSubmit = async (form) => {
    await login(form);
    toast.success('Sesión iniciada', { description: 'Bienvenido de vuelta a BancoGP.' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <main className="auth">
      <section className="auth__form-side">
        <header className="auth__header">
          <Brand />
          <ThemeToggle />
        </header>

        <div className="auth__form-wrap stagger">
          {logoFailed ? (
            <span className="auth__logo auth__logo--fallback" aria-hidden="true">
              GP
            </span>
          ) : (
            <img
              className="auth__logo"
              src={LOGO_URL}
              alt=""
              width="48"
              height="48"
              onError={() => setLogoFailed(true)}
            />
          )}
          <div className="auth__intro">
            <h1>Inicia sesión</h1>
            <p>Accede al sistema de gestión bancaria de BancoGP.</p>
          </div>
          <LoginForm onSubmit={handleSubmit} />
          <p className="auth__legal">Al continuar aceptas las políticas de uso y privacidad de BancoGP.</p>
        </div>

        <footer className="auth__footer">© {new Date().getFullYear()} BancoGP</footer>
      </section>

      <aside className="auth__showcase" aria-hidden="true">
        <DotPattern size={20} />
        <div className="auth__showcase-inner">
          <div className="bank-card">
            <div className="bank-card__top">
              <span className="bank-card__chip" />
              <span className="bank-card__brand">BancoGP</span>
            </div>
            <span className="bank-card__number">•••• •••• •••• 2024</span>
            <div className="bank-card__bottom">
              <span>Cuenta corriente</span>
              <span>12/30</span>
            </div>
          </div>

          <ul className="auth__features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="auth__feature-icon">
                  <Icon />
                </span>
                <div>
                  <p className="auth__feature-title">{title}</p>
                  <p className="auth__feature-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
