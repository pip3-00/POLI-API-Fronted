/**
 * API CLIENT - Politécnico Ann y Ted Kheel
 * Fetch wrapper con manejo centralizado de errores y autenticación
 */

import { API_URL } from '../../config.js';
import { getToken, redirectToLogin } from './auth.js';

/**
 * Fetch wrapper con manejo de errores HTTP y auth
 * @param {string} endpoint - Endpoint de la API (ej: "/content" o "/content/1")
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Promise<any>} - Datos de la respuesta
 * @throws {Error} - Error con mensaje descriptivo
 */
export async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    
    if (!token) {
        throw new Error('No hay sesión activa');
    }

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    };

    console.log(`🌐 API Request: ${options.method || 'GET'} ${API_URL}${endpoint}`);

    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    // Manejo de errores HTTP
    if (!response.ok) {
        console.error(`❌ API Error ${response.status}: ${response.statusText}`);
        
        if (response.status === 401 || response.status === 403) {
            redirectToLogin('Credenciales inválidas o sesión expirada');
            throw new Error('Sesión expirada');
        }
        
        let errorMsg = `Error ${response.status}: ${response.statusText}`;
        try {
            const errorData = await response.json();
            if (errorData.detail) {
                errorMsg = typeof errorData.detail === 'string' 
                    ? errorData.detail 
                    : JSON.stringify(errorData.detail);
            } else if (errorData.message) {
                errorMsg = errorData.message;
            }
        } catch (e) {
            // Error al parsear JSON, usar mensaje por defecto
        }
        
        throw new Error(errorMsg);
    }

    // Si response.status === 204 (No Content), retornar null
    if (response.status === 204) {
        return null;
    }

    return await response.json();
}

// Métodos HTTP helper
export const api = {
    /**
     * GET request
     * @param {string} endpoint 
     * @returns {Promise<any>}
     */
    get: (endpoint) => apiFetch(endpoint, { method: 'GET' }),
    
    /**
     * POST request
     * @param {string} endpoint 
     * @param {Object} data 
     * @returns {Promise<any>}
     */
    post: (endpoint, data) => apiFetch(endpoint, { 
        method: 'POST', 
        body: JSON.stringify(data) 
    }),
    
    /**
     * PUT request
     * @param {string} endpoint 
     * @param {Object} data 
     * @returns {Promise<any>}
     */
    put: (endpoint, data) => apiFetch(endpoint, { 
        method: 'PUT', 
        body: JSON.stringify(data) 
    }),
    
    /**
     * DELETE request
     * @param {string} endpoint 
     * @returns {Promise<any>}
     */
    delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' })
};

console.log('✅ API Client cargado correctamente');

