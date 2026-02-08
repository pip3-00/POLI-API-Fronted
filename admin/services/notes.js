/**
 * SERVICIO DE NOTAS - Politécnico Ann y Ted Kheel
 * CRUD para el módulo de notas del CMS
 */

import { api } from './api.js';

const NOTES_ENDPOINT = '/notes';

/**
 * Carga notas con filtros opcionales y paginación
 * @param {Object} filters - { page, type, is_active, limit, offset, search }
 * @returns {Promise<Object>} - { total, limit, offset, notas: Array }
 */
export async function loadNotes(filters = {}) {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.type) params.append('type', filters.type);
    if (filters.is_active !== undefined && filters.is_active !== '') {
        params.append('is_active', filters.is_active);
    }
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset !== undefined) params.append('offset', filters.offset);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString 
        ? `${NOTES_ENDPOINT}?${queryString}` 
        : NOTES_ENDPOINT;

    console.log('📄 Cargando notas con filtros:', filters);

    try {
        const response = await api.get(endpoint);
        console.log('📦 Respuesta backend /notes:', response);

        // NORMALIZACIÓN
        if (!response || typeof response !== 'object') {
            console.warn('⚠️ Respuesta inválida del backend:', response);
            return { total: 0, limit: 10, offset: 0, notas: [] };
        }

        const notas = Array.isArray(response.notas) ? response.notas : 
                      Array.isArray(response) ? response : [];

        const result = {
            total: typeof response.total === 'number' ? response.total : notas.length,
            limit: typeof response.limit === 'number' ? response.limit : 10,
            offset: typeof response.offset === 'number' ? response.offset : 0,
            notas: notas
        };

        console.log(`✅ Cargadas ${result.notas.length} notas de ${result.total} total`);
        return result;
    } catch (err) {
        console.error('❌ Error cargando notas:', err);
        return { total: 0, limit: 10, offset: 0, notas: [] };
    }
}

/**
 * Obtiene una nota por ID
 * @param {number} id - ID de la nota
 * @returns {Promise<Object>}
 */
export async function getNote(id) {
    console.log(`📄 Obteniendo nota ID: ${id}`);
    return await api.get(`${NOTES_ENDPOINT}/${id}`);
}

/**
 * Crea una nueva nota
 * @param {Object} noteData - Datos de la nota
 * @returns {Promise<Object>}
 */
export async function createNote(noteData) {
    console.log('📄 Creando nota:', noteData);
    return await api.post(NOTES_ENDPOINT, noteData);
}

/**
 * Actualiza una nota existente
 * @param {number} id - ID de la nota
 * @param {Object} noteData - Nuevos datos
 * @returns {Promise<Object>}
 */
export async function updateNote(id, noteData) {
    console.log(`📄 Actualizando nota ID: ${id}`, noteData);
    return await api.put(`${NOTES_ENDPOINT}/${id}`, noteData);
}

/**
 * Elimina una nota
 * @param {number} id - ID de la nota a eliminar
 * @returns {Promise<void>}
 */
export async function deleteNote(id) {
    console.log(`🗑️ Eliminando nota ID: ${id}`);
    return await api.delete(`${NOTES_ENDPOINT}/${id}`);
}

/**
 * Tipos de notas disponibles
 */
export const NOTE_TYPES = [
    { value: 'general', label: 'General' },
    { value: 'homework', label: 'Tarea' },
    { value: 'exam', label: 'Examen' },
    { value: 'announcement', label: 'Anuncio' },
    { value: 'reminder', label: 'Recordatorio' }
];

/**
 * Estados de notas
 */
export const NOTE_STATUS = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Activas' },
    { value: 'false', label: 'Inactivas' }
];

console.log('✅ Notes service cargado correctamente');

