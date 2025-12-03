import { useState } from "react";
import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import Dashboard from "./components/pages/Dashboard";
import type { PageType } from "./types/index";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLogin = (): void => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
  };

  const handleGetStarted = (): void => {
    setCurrentPage("login");
  };

  const handleRegister = (): void => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const navigateToRegister = (): void => {
    setCurrentPage("register");
  };

  const navigateToLogin = (): void => {
    setCurrentPage("login");
  };

  return (
    <>
      {currentPage === "landing" && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentPage === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={navigateToRegister}
        />
      )}
      {currentPage === "register" && (
        <RegisterPage
          onRegister={handleRegister}
          onNavigateToLogin={navigateToLogin}
        />
      )}
      {currentPage === "dashboard" && isAuthenticated && (
        <Dashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
