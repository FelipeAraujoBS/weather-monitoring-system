import React, { useState } from "react";
import { Cloud } from "lucide-react";
import Input from "../common/Input";
import { Button } from "../common/button";
import type { RegisterPageProps } from "../../types";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (): void => {
    if (formData.password === formData.confirmPassword) {
      onRegister();
    }
  };

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Cloud className="w-12 h-12 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">WeatherDash</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Criar Conta
        </h2>

        <div className="space-y-4">
          <Input
            label="Nome"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Seu nome"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
          />

          <Input
            label="Confirmar Senha"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Cadastrar
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{" "}
          <Button
            onClick={onNavigateToLogin}
            className="bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Faça login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
