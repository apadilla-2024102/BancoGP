import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './store/authStore.jsx';
import { ThemeProvider, useThemeContext } from './store/themeStore.jsx';
import AppRouter from './AppRouter.jsx';

const AppToaster = () => {
  const { resolvedTheme } = useThemeContext();
  return (
    <Toaster
      theme={resolvedTheme}
      position="bottom-right"
      closeButton
      toastOptions={{ className: 'app-toast' }}
    />
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
      <AppToaster />
    </ThemeProvider>
  );
}
