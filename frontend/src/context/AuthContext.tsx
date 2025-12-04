// src/contexts/AuthContext.tsx

import React, { createContext, useContext, type ReactNode } from "react";
import { useAuth, type UseAuthReturn } from "../hooks/useAuth"; // Importa seu hook

// 1. Cria o Contexto (com tipo undefined como valor inicial)
const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

// 2. Cria o Componente Provedor
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 3. Usa o hook que você já criou para obter toda a lógica
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// 4. Cria o hook de consumo (Hook helper)
export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};
