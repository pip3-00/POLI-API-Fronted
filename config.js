/**
 * CONFIGURACIÓN CENTRALIZADA - Politécnico Ann y Ted Kheel
 * URL base del API - Usando ES Modules
 */

// URL base del API
export const API_URL = "http://127.0.0.1:8000";

// Otras configuraciones globales si son necesarias
export const CONFIG = {
    API_URL: API_URL,
    APP_NAME: "Politécnico Ann y Ted Kheel",
    VERSION: "1.0.0"
};

console.log('✅ Configuración cargada:', CONFIG.APP_NAME, 'v' + CONFIG.VERSION);

