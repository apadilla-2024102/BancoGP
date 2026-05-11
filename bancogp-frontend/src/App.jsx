import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/authStore.jsx';
import AppRouter from './AppRouter.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
