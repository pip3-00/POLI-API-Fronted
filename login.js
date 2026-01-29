/**
 * MÓDULO DE LOGIN - Politécnico Ann y Ted Kheel
 * Maneja la autenticación de administradores con el backend FastAPI
 * 
 * Este archivo se puede usar para funcionalidades adicionales de login
 * o para integrar con otras páginas del sitio.
 */

// Configuración centralizada
const LOGIN_CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:8000',
    LOGIN_ENDPOINT: '/login',
    ADMIN_PAGE: 'admin.html',
    TOKEN_KEY: 'admin_token'
};

/**
 * Función principal de login
 * Envía credenciales al backend y maneja la respuesta
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<object>} - Respuesta del servidor
 */
async function performLogin(username, password) {
    console.log('📝 Iniciando proceso de login...');
    console.log('⏰ Timestamp:', new Date().toISOString());

    // Validar entradas
    if (!username || !password) {
        throw new Error('Por favor complete todos los campos');
    }

    username = String(username).trim();
    password = String(password);

    console.log('👤 Username:', JSON.stringify(username));
    console.log('🔒 Password length:', password.length);

    // Construir body JSON
    const loginData = {
        username: username,
        password: password
    };

    console.log('📦 JSON a enviar:', JSON.stringify(loginData));
    console.log('🔗 Endpoint:', LOGIN_CONFIG.API_BASE_URL + LOGIN_CONFIG.LOGIN_ENDPOINT);

    // Hacer petición al backend
    const response = await fetch(LOGIN_CONFIG.API_BASE_URL + LOGIN_CONFIG.LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    console.log('✅ Respuesta recibida');
    console.log('📊 HTTP Status:', response.status, response.statusText);

    // Obtener respuesta
    const responseText = await response.text();
    console.log('📄 Respuesta cruda:', responseText);

    // Parsear JSON
    let data;
    try {
        data = JSON.parse(responseText);
        console.log('✅ JSON parseado correctamente');
    } catch (parseError) {
        console.error('❌ Error parseando JSON:', parseError);
        throw new Error(`Respuesta inválida del servidor`);
    }

    // Manejar errores HTTP
    if (!response.ok) {
        console.error('❌ Error HTTP:', response.status);
        
        let errorMsg = 'Credenciales incorrectas';
        if (data.detail) {
            if (typeof data.detail === 'string') {
                errorMsg = data.detail;
            } else if (Array.isArray(data.detail)) {
                errorMsg = data.detail.map(err => err.msg || JSON.stringify(err)).join(', ');
            } else {
                errorMsg = JSON.stringify(data.detail);
            }
        } else if (data.message) {
            errorMsg = data.message;
        }
        
        throw new Error(errorMsg);
    }

    // Verificar token
    if (!data.access_token) {
        throw new Error('Respuesta inválida: no se recibió token');
    }

    // Guardar token
    localStorage.setItem(LOGIN_CONFIG.TOKEN_KEY, data.access_token);
    console.log('✅ Token guardado en localStorage');
    console.log('📏 Token length:', data.access_token.length);

    return data;
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = localStorage.getItem(LOGIN_CONFIG.TOKEN_KEY);
    const isAuth = !!token;
    console.log('🔐 Estado de autenticación:', isAuth ? 'Autenticado' : 'No autenticado');
    return isAuth;
}

/**
 * Obtiene el token de autenticación
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem(LOGIN_CONFIG.TOKEN_KEY);
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem(LOGIN_CONFIG.TOKEN_KEY);
    console.log('✅ Sesión cerrada');
    window.location.href = 'login.html';
}

/**
 * Redirige a la página de admin si está autenticado
 * @returns {boolean}
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        console.log('➡️ Usuario autenticado, redirigiendo a', LOGIN_CONFIG.ADMIN_PAGE);
        window.location.href = LOGIN_CONFIG.ADMIN_PAGE;
        return true;
    }
    return false;
}

// Exportar funciones globalmente
window.LoginManager = {
    config: LOGIN_CONFIG,
    login: performLogin,
    isAuthenticated: isAuthenticated,
    getToken: getToken,
    logout: logout,
    redirectIfAuthenticated: redirectIfAuthenticated
};

console.log('✅ Login Manager cargado correctamente');

