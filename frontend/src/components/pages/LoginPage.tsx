import React, { useState } from "react";
import { Cloud } from "lucide-react";
import Input from "../common/Input";
import { Button } from "../common/button";
import type { LoginPageProps } from "../../types/index";

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (): void => {
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Cloud className="w-12 h-12 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">WeatherDash</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Login
        </h2>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Entrar
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem uma conta?{" "}
          <button
            onClick={onNavigateToRegister}
            className="text-blue-600 hover:underline font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
