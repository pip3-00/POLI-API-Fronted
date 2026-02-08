/**
 * SERVICIO DE CONTENIDOS - Politécnico Ann y Ted Kheel
 * CRUD genérico para el modelo Content del backend
 */

import { api } from './api.js';

const CONTENT_ENDPOINT = '/content';


/**
 * Carga contenidos con filtros opcionales y paginación
 * @param {Object} filters - { page, type, is_active, limit, offset }
 * @returns {Promise<Object>} - { total, limit, offset, contenidos: Array }
 */
export async function loadContent(filters = {}) {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.type) params.append('type', filters.type);
    if (filters.is_active !== undefined && filters.is_active !== '') {
        params.append('is_active', filters.is_active);
    }
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset !== undefined) params.append('offset', filters.offset);

    const queryString = params.toString();
    const endpoint = queryString 
        ? `${CONTENT_ENDPOINT}?${queryString}` 
        : CONTENT_ENDPOINT;

    console.log('📄 Cargando contenidos con filtros:', filters);

    const response = await api.get(endpoint);
    console.log('📦 Respuesta backend /content:', response);

    // 🔑 NORMALIZACIÓN CRÍTICA
    // El backend devuelve: { total: 113, limit, offset, contenidos: [...] }
    // Devolvemos el objeto completo para que el frontend pueda calcular paginación
    
    // Verificar que response sea un objeto
    if (!response || typeof response !== 'object') {
        console.warn('⚠️ Respuesta inválida del backend:', response);
        return { total: 0, limit: 10, offset: 0, contenidos: [] };
    }
    
    // Verificar que contenidos sea un array, si no, inicializar como array vacío
    const contenidos = Array.isArray(response.contenidos) ? response.contenidos : [];
    
    // Extraer metadata de paginación con valores por defecto
    const result = {
        total: typeof response.total === 'number' ? response.total : 0,
        limit: typeof response.limit === 'number' ? response.limit : 10,
        offset: typeof response.offset === 'number' ? response.offset : 0,
        contenidos: contenidos
    };
    
    console.log(`✅ Cargados ${result.contenidos.length} contenidos de ${result.total} total`);
    return result;
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

/**
 * Carga dinámicamente los tipos de contenido desde el backend
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export async function loadContentTypes() {
    try {
        const response = await api.get('/content-types');
        console.log("DATA RECIBIDA →", response);

        const tipos = response.tipos_contenido ?? [];

        return tipos
            .filter(t => t.is_active)
            .map(t => ({
                value: t.key,
                label: t.label
            }));

    } catch (err) {
        console.error('❌ Error cargando tipos de contenido:', err);
        return [];
    }
}

/**
 * Función para rellenar un select en el panel admin con los tipos de contenido
 * @param {string} selectId - id del elemento <select>
 */
export async function fillContentTypeSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const tipos = await loadContentTypes();
    select.innerHTML = '';
    tipos.forEach(t => {
        const option = document.createElement('option');
        option.value = t.value;
        option.textContent = t.label;
        select.appendChild(option);
    });
}

/**
 * Constantes para páginas comunes en el CMS (pueden seguir siendo hardcodeadas)
 */
export const CONTENT_PAGES = [
    { value: 'home', label: 'Inicio' },
    { value: 'about', label: 'Nosotros' },
    { value: 'contact', label: 'Contacto' }
];

console.log('✅ Content service cargado correctamente');
