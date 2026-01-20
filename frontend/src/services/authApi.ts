import { API_CONFIG } from "../config/api";
import type { LoginCredentials, RegisterData, AuthResponse } from "../types";

export class AuthApiService {
  private static baseUrl = API_CONFIG.BASE_URL;

  /**
   * Login do usuário
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao fazer login");
    }

    return await response.json();
  }

  /**
   * Registro de novo usuário
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.REGISTER}`,
      {
        method: "POST",
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao criar conta");
    }

    return await response.json();
  }

  /**
   * Salva token no localStorage
   */
  static saveToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  /**
   * Obtém token do localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  /**
   * Remove token do localStorage
   */
  static removeToken(): void {
    localStorage.removeItem("auth_token");
  }

  /**
   * Verifica se usuário está autenticado
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
