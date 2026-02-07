/**
 * SERVICIO DE CONTENIDOS - Politécnico Ann y Ted Kheel
 * CRUD genérico para el modelo Content del backend
 */

import { api } from './api.js';

const CONTENT_ENDPOINT = '/content';

/**
 * Carga contenidos con filtros opcionales
 * @param {Object} filters - { page, type, is_active }
 * @returns {Promise<Array>}
 */

export async function loadContent(filters = {}) {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.type) params.append('type', filters.type);
    if (filters.is_active !== undefined && filters.is_active !== '') {
        params.append('is_active', filters.is_active);
    }

    const queryString = params.toString();
    const endpoint = queryString 
        ? `${CONTENT_ENDPOINT}?${queryString}` 
        : CONTENT_ENDPOINT;

    console.log('📄 Cargando contenidos con filtros:', filters);

    const response = await api.get(endpoint);
    console.log('📦 Respuesta backend /content:', response);

    // 🔑 NORMALIZACIÓN
    return response.contenidos ?? [];
}


/**
 * Obtiene un contenido por ID
 * @param {number} id - ID del contenido
 * @returns {Promise<Object>}
 */
export async function getContent(id) {
    console.log(`📄 Obteniendo contenido ID: ${id}`);
    return await api.get(`${CONTENT_ENDPOINT}/${id}`);
}

/**
 * Crea un nuevo contenido
 * @param {Object} contentData - Datos del contenido
 * @returns {Promise<Object>}
 */
export async function createContent(contentData) {
    console.log('📄 Creando contenido:', contentData);
    return await api.post(CONTENT_ENDPOINT, contentData);
}

/**
 * Actualiza un contenido existente
 * @param {number} id - ID del contenido
 * @param {Object} contentData - Nuevos datos
 * @returns {Promise<Object>}
 */
export async function updateContent(id, contentData) {
    console.log(`📄 Actualizando contenido ID: ${id}`, contentData);
    return await api.put(`${CONTENT_ENDPOINT}/${id}`, contentData);
}

/**
 * Elimina un contenido
 * @param {number} id - ID del contenido a eliminar
 * @returns {Promise<void>}
 */
export async function deleteContent(id) {
    console.log(`🗑️ Eliminando contenido ID: ${id}`);
    return await api.delete(`${CONTENT_ENDPOINT}/${id}`);
}

// Constantes para tipos y páginas comunes (para usar en el frontend)
export const CONTENT_TYPES = [
    { value: 'news', label: 'Noticia' },
    { value: 'page', label: 'Página' },
    { value: 'section', label: 'Sección' },
    { value: 'image', label: 'Imagen' }
];

export const CONTENT_PAGES = [
    { value: 'home', label: 'Inicio' },
    { value: 'about', label: 'Nosotros' },
    { value: 'global', label: 'Global' },
    { value: 'academics', label: 'Académicos' },
    { value: 'admissions', label: 'Admisiones' },
    { value: 'contact', label: 'Contacto' }
];

console.log('✅ Content service cargado correctamente');

