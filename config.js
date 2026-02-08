/**
 * CONFIGURACIÓN CENTRALIZADA - Politécnico Ann y Ted Kheel
 * URL base del API - Usando ES Modules
 */

// ⚙️ CONFIGURACIÓN DE RED - Cambia esta IP según tu red local
// Para acceder desde otro dispositivo en la misma red Wi-Fi
const LOCAL_IP = "10.0.0.10"; // ← Reemplaza con la IP de tu computadora
const API_PORT = "8000";

// URL base del API - Usa la IP local para acceso desde red
export const API_URL = `http://${LOCAL_IP}:${API_PORT}`;

// Otras configuraciones globales si son necesarias
export const CONFIG = {
    API_URL: API_URL,
    APP_NAME: "Politécnico Ann y Ted Kheel",
    VERSION: "1.0.0"
};

console.log('✅ Configuración cargada:', CONFIG.APP_NAME, 'v' + CONFIG.VERSION);
console.log('📡 API URL:', API_URL);

