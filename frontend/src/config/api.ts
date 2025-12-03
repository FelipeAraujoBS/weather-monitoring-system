export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/users",

    // Weather
    WEATHER: "/weather",
    WEATHER_LATEST: "/weather/latest",
    WEATHER_HISTORY: "/weather/history",
    WEATHER_STATS: "/weather/stats",
    WEATHER_EXPORT: "/weather/export",
    WEATHER_INSIGHT: (id: string) => `/weather/${id}/insight`,
  },
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Helper para adicionar token ao header
export const getAuthHeaders = (token?: string) => ({
  ...API_CONFIG.HEADERS,
  ...(token && { Authorization: `Bearer ${token}` }),
});
