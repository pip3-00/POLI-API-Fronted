// ===== CONFIGURACIÓN CENTRALIZADA =====
// Este archivo debe cargarse PRIMERO en el HTML antes que otros archivos JS

// URL base del API
const API_URL = "http://127.0.0.1:8000";

// Otras configuraciones globales si son necesarias
const CONFIG = {
    API_URL: API_URL,
    APP_NAME: "Politécnico Ann y Ted Kheel",
    VERSION: "1.0.0"
};

// Hacer CONFIG disponible globalmente
window.CONFIG = CONFIG;

