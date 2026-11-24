import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/authStore.jsx';
import AppRouter from './AppRouter.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}
