/**
 * NOTES MODULE - Politécnico Ann y Ted Kheel
 * Gestión de notas en el CMS
 */

import { API_URL } from '../config.js';
import { requireAuth, logout } from './services/auth.js';
import { loadNotes, getNote, createNote, updateNote, deleteNote } from './services/notes.js';

// Verificar autenticación
if (!requireAuth()) {
    console.log('🔒 Redirigiendo a login...');
}

// Variables globales
let currentNotes = [];
let currentPage = 1;
const limit = 10;
let editingNoteId = null;
let noteToDeleteId = null;

// Elementos del DOM
const elements = {
    // Contenedores principales
    loadingSpinner: document.getElementById('loadingSpinnerNotes'),
    tableContainer: document.getElementById('tableContainerNotes'),
    emptyState: document.getElementById('emptyStateNotes'),
    paginationContainer: document.getElementById('paginationContainerNotes'),
    notesCount: document.getElementById('notesCount'),
    
    // Tabla
    notesTableBody: document.getElementById('notesTableBody'),
    
    // Filtros
    filterNoteType: document.getElementById('filterNoteType'),
    filterNoteActive: document.getElementById('filterNoteActive'),
    searchNotes: document.getElementById('searchNotes'),
    
    // Botones
    btnRefresh: document.getElementById('btnRefreshNotes'),
    btnClearFilters: document.getElementById('btnClearNoteFilters'),
    btnNewNote: document.getElementById('btnNewNote'),
    btnSaveNote: document.getElementById('btnSaveNote'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Modales
    noteModal: document.getElementById('noteModal'),
    deleteNoteModal: document.getElementById('deleteNoteModal'),
    
    // Formularios
    noteForm: document.getElementById('noteForm'),
    
    // Paginación
    paginationRange: document.getElementById('paginationRangeNotes'),
    paginationControls: document.getElementById('paginationControlsNotes'),
    
    // Alertas
    alertContainer: document.getElementById('alertContainer')
};

// Iconos por tipo de nota
const noteTypeIcons = {
    general: 'fa-book',
    homework: 'fa-book-open',
    exam: 'fa-clipboard-check',
    announcement: 'fa-bullhorn',
    reminder: 'fa-bell'
};

// Colores por tipo de nota
const noteTypeColors = {
    general: 'primary',
    homework: 'info',
    exam: 'warning',
    announcement: 'success',
    reminder: 'danger'
};

/**
 * Inicializar el módulo de notas
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔥 notes.js - DOMContentLoaded');
    await loadNotesModule();
});

async function loadNotesModule() {
    try {
        console.log('📡 Cargando módulo de notas...');
        
        // Configurar event listeners
        setupEventListeners();
        
        // Configurar fecha por defecto en el modal
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('noteDate').value = today;
        
        // Cargar notas
        await refreshNotes();
        
        console.log('✅ Módulo de notas cargado correctamente');
    } catch (err) {
        console.error('❌ Error inicializando módulo de notas:', err);
        showAlert('danger', 'Error al cargar el módulo de notas');
    }
}

/**
 * Configurar todos los event listeners
 */
function setupEventListeners() {
    // Logout
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', logout);
    }
    
    // Refrescar
    if (elements.btnRefresh) {
        elements.btnRefresh.addEventListener('click', refreshNotes);
    }
    
    // Limpiar filtros
    if (elements.btnClearFilters) {
        elements.btnClearFilters.addEventListener('click', clearFilters);
    }
    
    // Nuevo contenido
    if (elements.btnNewNote) {
        elements.btnNewNote.addEventListener('click', () => openNewNoteModal());
    }
    
    // Guardar nota
    if (elements.btnSaveNote) {
        elements.btnSaveNote.addEventListener('click', saveNote);
    }
    
    // Eliminar nota confirmado
    const btnConfirmDeleteNote = document.getElementById('btnConfirmDeleteNote');
    if (btnConfirmDeleteNote) {
        btnConfirmDeleteNote.addEventListener('click', confirmDeleteNote);
    }
    
    // Filtros con debounce
    if (elements.filterNoteType) {
        elements.filterNoteType.addEventListener('change', () => {
            currentPage = 1;
            refreshNotes();
        });
    }
    
    if (elements.filterNoteActive) {
        elements.filterNoteActive.addEventListener('change', () => {
            currentPage = 1;
            refreshNotes();
        });
    }
    
    if (elements.searchNotes) {
        let searchTimeout;
        elements.searchNotes.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentPage = 1;
                refreshNotes();
            }, 300);
        });
    }
    
    // Limpiar modal al cerrar
    if (elements.noteModal) {
        elements.noteModal.addEventListener('hidden.bs.modal', () => {
            resetNoteForm();
        });
    }
}

/**
 * Refrescar lista de notas
 */
async function refreshNotes() {
    try {
        showLoading(true);
        
        const filters = {
            page: currentPage,
            limit: limit,
            type: elements.filterNoteType?.value || '',
            is_active: elements.filterNoteActive?.value || '',
            search: elements.searchNotes?.value || ''
        };
        
        const data = await loadNotes(filters);
        currentNotes = data.notas || [];
        
        // Ocultar spinner siempre
        showLoading(false);
        
        if (currentNotes.length === 0) {
            // Mostrar empty state
            showEmptyState(true);
            showTable(false);
            updateNotesCount(0);
        } else {
            // Mostrar tabla, renderizar filas
            showEmptyState(false);
            showTable(true);
            renderNotes(currentNotes);
            updateNotesCount(data.total || currentNotes.length);
            renderPagination(data.total || currentNotes.length, data.limit, data.offset);
        }
    } catch (err) {
        console.error('❌ Error refrescando notas:', err);
        showLoading(false);
        showAlert('danger', 'Error al cargar las notas');
    }
}

/**
 * Renderizar tabla de notas
 */
function renderNotes(notes) {
    const tableBody = elements.notesTableBody;
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    notes.forEach(note => {
        const tr = document.createElement('tr');
        
        const typeIcon = noteTypeIcons[note.type] || 'fa-book';
        const typeColor = noteTypeColors[note.type] || 'primary';
        const typeLabel = getNoteTypeLabel(note.type);
        const date = note.date || note.created_at || new Date().toISOString().split('T')[0];
        
        tr.innerHTML = `
            <td>${note.id}</td>
            <td>
                <span class="badge bg-${typeColor}">
                    <i class="fas ${typeIcon} me-1"></i>
                    ${typeLabel}
                </span>
            </td>
            <td>${formatDate(date)}</td>
            <td><strong>${escapeHtml(note.title)}</strong></td>
            <td>${escapeHtml(truncateText(note.description || '', 50))}</td>
            <td>${note.is_active ? 'Sí' : 'No'}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary action-btn btn-edit-note" data-id="${note.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn btn-delete-note" data-id="${note.id}" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(tr);
    });
    
    // Agregar event listeners a los botones
    tableBody.querySelectorAll('.btn-edit-note').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            openEditNoteModal(id);
        });
    });
    
    tableBody.querySelectorAll('.btn-delete-note').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            openDeleteNoteModal(id);
        });
    });
}

/**
 * Abrir modal para nueva nota
 */
function openNewNoteModal() {
    editingNoteId = null;
    resetNoteForm();
    document.getElementById('modalNoteTitle').textContent = 'Nueva Nota';
    document.getElementById('btnSaveNoteText').textContent = 'Guardar';
}

/**
 * Abrir modal para editar nota
 */
async function openEditNoteModal(id) {
    try {
        showLoading(true);
        const note = await getNote(id);
        showLoading(false);
        
        if (!note) {
            showAlert('danger', 'Nota no encontrada');
            return;
        }
        
        editingNoteId = id;
        
        // Llenar formulario
        document.getElementById('noteId').value = note.id;
        document.getElementById('noteType').value = note.type || '';
        document.getElementById('noteTitle').value = note.title || '';
        document.getElementById('noteDescription').value = note.description || '';
        document.getElementById('noteDate').value = note.date || '';
        document.getElementById('notePriority').value = note.priority || 'normal';
        document.getElementById('noteIsActive').checked = note.is_active !== false;
        
        document.getElementById('modalNoteTitle').textContent = 'Editar Nota';
        document.getElementById('btnSaveNoteText').textContent = 'Actualizar';
        
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('noteModal'));
        modal.show();
        
    } catch (err) {
        console.error('❌ Error cargando nota:', err);
        showLoading(false);
        showAlert('danger', 'Error al cargar la nota');
    }
}

/**
 * Guardar nota (crear o actualizar)
 */
async function saveNote() {
    try {
        // Validar formulario
        const noteType = document.getElementById('noteType').value;
        const noteTitle = document.getElementById('noteTitle').value.trim();
        
        if (!noteType) {
            showAlert('warning', 'Por favor selecciona un tipo de nota');
            return;
        }
        
        if (!noteTitle) {
            showAlert('warning', 'Por favor ingresa un título');
            return;
        }
        
        // Preparar datos
        const noteData = {
            type: noteType,
            title: noteTitle,
            description: document.getElementById('noteDescription').value.trim(),
            date: document.getElementById('noteDate').value,
            priority: document.getElementById('notePriority').value,
            is_active: document.getElementById('noteIsActive').checked
        };
        
        // Deshabilitar botón mientras se guarda
        const btnSave = document.getElementById('btnSaveNote');
        const originalText = btnSave.innerHTML;
        btnSave.disabled = true;
        btnSave.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Guardando...';
        
        let savedNote;
        
        if (editingNoteId) {
            // Actualizar nota existente
            savedNote = await updateNote(editingNoteId, noteData);
            showAlert('success', 'Nota actualizada correctamente');
        } else {
            // Crear nueva nota
            savedNote = await createNote(noteData);
            showAlert('success', 'Nota creada correctamente');
        }
        
        // Habilitar botón
        btnSave.disabled = false;
        btnSave.innerHTML = originalText;
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
        modal.hide();
        
        // Refrescar lista
        await refreshNotes();
        
    } catch (err) {
        console.error('❌ Error guardando nota:', err);
        showAlert('danger', 'Error al guardar la nota: ' + err.message);
        
        // Habilitar botón
        const btnSave = document.getElementById('btnSaveNote');
        btnSave.disabled = false;
        btnSave.innerHTML = document.getElementById('btnSaveNoteText').textContent === 'Actualizar' ? 
            '<i class="fas fa-save me-1"></i> Actualizar' : '<i class="fas fa-save me-1"></i> Guardar';
    }
}

/**
 * Abrir modal de confirmación para eliminar
 */
function openDeleteNoteModal(id) {
    const note = currentNotes.find(n => n.id === id);
    if (!note) return;
    
    noteToDeleteId = id;
    
    document.getElementById('deleteNoteType').textContent = getNoteTypeLabel(note.type);
    document.getElementById('deleteNoteTitle').textContent = note.title;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteNoteModal'));
    modal.show();
}

/**
 * Confirmar eliminación de nota
 */
async function confirmDeleteNote() {
    try {
        const btnConfirm = document.getElementById('btnConfirmDeleteNote');
        btnConfirm.disabled = true;
        btnConfirm.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Eliminando...';
        
        await deleteNote(noteToDeleteId);
        
        showAlert('success', 'Nota eliminada correctamente');
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteNoteModal'));
        modal.hide();
        
        // Refrescar lista
        await refreshNotes();
        
    } catch (err) {
        console.error('❌ Error eliminando nota:', err);
        showAlert('danger', 'Error al eliminar la nota: ' + err.message);
    } finally {
        const btnConfirm = document.getElementById('btnConfirmDeleteNote');
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = '<i class="fas fa-trash me-1"></i> Eliminar';
    }
}

/**
 * Resetear formulario de nota
 */
function resetNoteForm() {
    editingNoteId = null;
    document.getElementById('noteForm').reset();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('noteDate').value = today;
    document.getElementById('noteIsActive').checked = true;
    document.getElementById('notePriority').value = 'normal';
    
    document.getElementById('modalNoteTitle').textContent = 'Nueva Nota';
    document.getElementById('btnSaveNoteText').textContent = 'Guardar';
}

/**
 * Limpiar filtros
 */
function clearFilters() {
    if (elements.filterNoteType) elements.filterNoteType.value = '';
    if (elements.filterNoteActive) elements.filterNoteActive.value = '';
    if (elements.searchNotes) elements.searchNotes.value = '';
    currentPage = 1;
    refreshNotes();
}

/**
 * Renderizar paginación
 */
function renderPagination(total, limit, offset) {
    if (!elements.paginationContainer || !elements.paginationControls) return;
    
    const totalPages = Math.ceil(total / limit);
    const start = offset + 1;
    const end = Math.min(offset + limit, total);
    
    elements.paginationRange.textContent = `Mostrando ${start}-${end} de ${total}`;
    
    elements.paginationControls.innerHTML = '';
    
    // Botón anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" tabindex="-1" ${currentPage === 1 ? 'aria-disabled="true"' : ''}>
            <i class="fas fa-chevron-left"></i>
        </a>
    `;
    if (currentPage > 1) {
        prevLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            refreshNotes();
        });
    }
    elements.paginationControls.appendChild(prevLi);
    
    // Números de página
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        
        if (i !== currentPage) {
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                refreshNotes();
            });
        }
        
        elements.paginationControls.appendChild(li);
    }
    
    // Botón siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" ${currentPage === totalPages ? 'aria-disabled="true"' : ''}>
            <i class="fas fa-chevron-right"></i>
        </a>
    `;
    if (currentPage < totalPages) {
        nextLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            refreshNotes();
        });
    }
    elements.paginationControls.appendChild(nextLi);
    
    elements.paginationContainer.style.display = 'flex';
}

// Funciones de utilidad
function showLoading(show) {
    if (elements.loadingSpinner) {
        elements.loadingSpinner.style.display = show ? 'flex' : 'none';
    }
    if (elements.tableContainer) {
        elements.tableContainer.style.display = show ? 'none' : 'none';
    }
    if (elements.emptyState) {
        elements.emptyState.style.display = show ? 'none' : 'none';
    }
}

function showTable(show) {
    if (elements.tableContainer) {
        elements.tableContainer.style.display = show ? 'block' : 'none';
    }
    if (elements.paginationContainer) {
        elements.paginationContainer.style.display = show ? 'flex' : 'none';
    }
}

function showEmptyState(show) {
    if (elements.emptyState) {
        elements.emptyState.style.display = show ? 'block' : 'none';
    }
}

function updateNotesCount(count) {
    if (elements.notesCount) {
        elements.notesCount.textContent = `${count} ${count === 1 ? 'nota' : 'notas'}`;
    }
}

function showAlert(type, message) {
    if (!elements.alertContainer) return;
    
    elements.alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? '-times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    elements.alertContainer.style.display = 'block';
    
    // Auto ocultar después de 5 segundos
    setTimeout(() => {
        const alert = elements.alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

function getNoteTypeLabel(type) {
    const labels = {
        general: 'General',
        homework: 'Tarea',
        exam: 'Examen',
        announcement: 'Anuncio',
        reminder: 'Recordatorio'
    };
    return labels[type] || 'General';
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('✅ notes.js cargado correctamente');

