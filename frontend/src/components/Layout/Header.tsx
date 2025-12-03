import React from "react";
import { Cloud, LogOut } from "lucide-react";
import type { HeaderProps } from "../../types/index";

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Cloud className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">WeatherDash</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-blue-600 font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Histórico
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Alertas
            </a>
          </nav>

          <button
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
