import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Cloud } from "lucide-react";
import Input from "../common/Input";
import { Button } from "../common/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const errors: { email?: string; password?: string; confirmPassword?: string } = {};
    const { email, password, confirmPassword } = formData;

    if (!email) errors.email = "Email é obrigatório";
    if (!password) errors.password = "Senha é obrigatória";
    else if (password.length < 8) errors.password = "Mínimo de 8 caracteres";
    if (password !== confirmPassword) errors.confirmPassword = "Senhas não coincidem";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      await register({ email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const {
    register,
    loading: isLoading,
    error: authError,
    isAuthenticated,
  } = useAuthContext();

  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined });
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
          Criar Conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="register-email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            required
            error={fieldErrors.email}
          />

          <Input
            id="register-password"
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            error={fieldErrors.password}
          />

          <Input
            id="register-confirm-password"
            label="Confirmar Senha"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            error={fieldErrors.confirmPassword}
          />

          {authError && (
            <p className="text-red-500 text-sm text-center font-medium">{authError}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{" "}
          <Button
            onClick={() => navigate("/login")}
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
