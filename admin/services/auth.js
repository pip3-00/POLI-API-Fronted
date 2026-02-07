/**
 * SERVICIO DE AUTENTICACIÓN - Politécnico Ann y Ted Kheel
 * Manejo de tokens JWT y sesión de administrador
 */

const TOKEN_KEY = 'admin_token';

/**
 * Obtiene el token de autenticación desde localStorage
 * @returns {string|null}
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
export function isAuthenticated() {
    const token = getToken();
    return !!token;
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem(TOKEN_KEY);
    // Limpiar cualquier mensaje de error de sesión
    sessionStorage.removeItem('auth_error');
    window.location.href = '../login.html';
}

/**
 * Redirige a login si no hay autenticación
 * @param {string} reason - Motivo de la redirección
 */
export function redirectToLogin(reason = 'Tu sesión ha expirado') {
    // Guardar mensaje para mostrar en login
    sessionStorage.setItem('auth_error', reason);
    logout();
}

/**
 * Requiere autenticación - redirige a login si no hay token
 * @returns {boolean} - true si está autenticado, false si redirigió
 */
export function requireAuth() {
    if (!isAuthenticated()) {
        redirectToLogin('No hay sesión activa');
        return false;
    }
    return true;
}

/**
 * Obtiene el mensaje de error de autenticación y lo limpia
 * @returns {string|null}
 */
export function getAuthError() {
    const error = sessionStorage.getItem('auth_error');
    sessionStorage.removeItem('auth_error');
    return error;
}

console.log('✅ Auth service cargado correctamente');

