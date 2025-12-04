import { useState } from "react";
import { AuthApiService } from "../services/authApi";
import type { LoginCredentials, RegisterData, User } from "../types";

export interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    AuthApiService.isAuthenticated()
  );

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthApiService.login(credentials);
      AuthApiService.saveToken(response.data.access_token);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthApiService.register(data);
      AuthApiService.saveToken(response.data.access_token);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthApiService.removeToken();
    setIsAuthenticated(false);
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
  };
};
