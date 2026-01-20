// src/components/ProtectedRoute.tsx

import React from "react";
// Importe os componentes de roteamento
import { Navigate, Outlet } from "react-router-dom";
// Importe o hook do seu Contexto
import { useAuthContext } from "../../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  // 1. Obtém o estado de autenticação do seu Contexto
  const { isAuthenticated, loading } = useAuthContext();

  // Opcional: Renderiza um indicador de carregamento enquanto o token está sendo checado
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Você pode usar um spinner ou um texto aqui */}
        <p className="text-gray-600">Carregando autenticação...</p>
      </div>
    );
  }

  // 2. Lógica Principal: Se o usuário NÃO estiver autenticado
  if (!isAuthenticated) {
    // Redireciona para a rota de login (/login)
    // O 'replace: true' garante que a página do Dashboard não fique no histórico
    return <Navigate to="/login" replace />;
  }

  // 3. Se o usuário estiver autenticado, renderiza o conteúdo da rota.
  // O <Outlet /> renderiza o componente filho da rota (que, neste caso, é o Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
