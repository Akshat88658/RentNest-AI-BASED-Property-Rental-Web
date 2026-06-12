import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.data,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'USER_LOADED':
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!state.token) {
        dispatch({ type: 'AUTH_ERROR' });
        return;
      }
      try {
        const res = await api.get('/auth/me');
        dispatch({ type: 'USER_LOADED', payload: res.data.data });
      } catch {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };
    loadUser();
  }, [state.token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Silent fail
    }
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
