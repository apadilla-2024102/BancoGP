import { createContext, useContext } from 'react';
import { useTheme } from '../shared/hooks/useTheme.js';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext debe usarse dentro de ThemeProvider');
  return context;
};
