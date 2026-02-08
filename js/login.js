/**
 * MÓDULO DE LOGIN - Politécnico Ann y Ted Kheel
 * Maneja la autenticación de administradores con el backend FastAPI
 */

const API_URL = "http://127.0.0.1:8000";
const TOKEN_KEY = 'admin_token';
const LOGIN_ENDPOINT = '/auth/login';
const ADMIN_PAGE = 'admin/admin.html';

// ===== ELEMENTOS DEL DOM =====
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');
const successContainer = document.getElementById('successContainer');

// ===== EVENT LISTENERS =====

/**
 * Evento submit del formulario
 */
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('📝 Formulario de login enviado');
        
        try {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            if (!username || !password) {
                throw new Error('Por favor complete todos los campos');
            }
            
            setLoadingState(true);
            hideError();
            
            const response = await fetch(`${API_URL}${LOGIN_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                })
            });
            
            console.log('📊 Response status:', response.status);
            
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error(`Respuesta inválida del servidor`);
            }
            
            if (!response.ok) {
                let errorMsg = 'Credenciales incorrectas';
                if (data.detail) {
                    errorMsg = typeof data.detail === 'string' 
                        ? data.detail 
                        : JSON.stringify(data.detail);
                } else if (data.message) {
                    errorMsg = data.message;
                }
                throw new Error(errorMsg);
            }
            
            // Login exitoso
            if (!data.access_token) {
                throw new Error('No se recibió token de autenticación');
            }
            
            localStorage.setItem(TOKEN_KEY, data.access_token);
            console.log('✅ Token guardado correctamente');
            
            showSuccess();
            
            setTimeout(() => {
                window.location.href = ADMIN_PAGE;
            }, 1500);
            
        } catch (error) {
            console.error('❌ Error en login:', error.message);
            showError(error.message || 'Error de conexión');
        } finally {
            setLoadingState(false);
        }
    });
}

// ===== FUNCIONES AUXILIARES =====

function setLoadingState(loading) {
    if (!submitBtn) return;
    
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

function showError(message) {
    if (!errorContainer || !errorMessage) return;
    
    errorMessage.textContent = message;
    errorContainer.classList.add('show');
    if (successContainer) successContainer.classList.remove('show');
    
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    if (errorContainer) {
        errorContainer.classList.remove('show');
    }
}

function showSuccess() {
    hideError();
    if (successContainer) {
        successContainer.classList.add('show');
    }
    if (usernameInput) usernameInput.disabled = true;
    if (passwordInput) passwordInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
}

function checkExistingSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        window.location.href = ADMIN_PAGE;
    }
}

function showAuthError() {
    const error = sessionStorage.getItem('auth_error');
    if (error && errorContainer) {
        showError(error);
    }
}

function init() {
    console.log('🚀 Módulo de login inicializado');
    console.log('📡 API URL:', API_URL);
    
    checkExistingSession();
    showAuthError();
    
    if (usernameInput) {
        usernameInput.focus();
    }
}

// ===== INICIALIZACIÓN =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Logout function global
window.logoutAdmin = function() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = 'login.html';
};

console.log('✅ Login.js cargado correctamente');

