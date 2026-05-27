import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getUserProfile, loginUser } from '../shared/api/authApi.js';

const AUTH_STORAGE_KEY = 'bancogp_auth';
const AuthContext = createContext(null);

const getSavedAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getDevAuth = () => ({
  token: 'dev-token',
  user: {
    id: 'dev',
    username: 'demo',
    email: 'demo@local',
    role: 'ADMIN'
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = getSavedAuth();
    if (savedAuth?.token) {
      setToken(savedAuth.token);
      if (savedAuth.user) {
        setUser(savedAuth.user);
      }
      getUserProfile()
        .then((profile) => {
          setUser(profile);
          const authRecord = { token: savedAuth.token, user: profile };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authRecord));
        })
        .catch(() => {
          if (import.meta.env.DEV) {
            const devAuth = getDevAuth();
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(devAuth));
            setToken(devAuth.token);
            setUser(devAuth.user);
          } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (import.meta.env.DEV) {
      const devAuth = getDevAuth();
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(devAuth));
      setToken(devAuth.token);
      setUser(devAuth.user);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    const authData = await loginUser({ emailOrUsername: email, password });

    if (!authData?.token) {
      throw new Error(authData?.message || 'Error al iniciar sesión');
    }

    const userData = {
      id: authData.userDetails?.id ?? authData.id ?? '',
      username: authData.userDetails?.username ?? authData.username ?? email,
      email: authData.userDetails?.email ?? authData.email ?? '',
      role: authData.userDetails?.role ?? 'USER',
      profilePicture: authData.userDetails?.profilePicture ?? null,
    };

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: authData.token, user: userData })
    );

    setToken(authData.token);
    setUser(userData);

    return authData;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
