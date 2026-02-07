/**
 * PANEL DE ADMINISTRACIÓN CMS - Politécnico Ann y Ted Kheel
 * Gestión genérica de contenidos del backend FastAPI
 */

// ===== IMPORTS =====
import { API_URL } from '../config.js';
import { getToken, logout, requireAuth } from './services/auth.js';
import { api } from './services/api.js';
import { loadContent, createContent, updateContent, deleteContent, getContent } from './services/content.js';

// ===== CONSTANTES =====
const TOKEN_KEY = 'admin_token';

// ===== ESTADO =====
let contents = [];
let currentFilters = {
    type: '',
    page: '',
    is_active: ''
};
let contentToDelete = null;

// ===== ELEMENTOS DEL DOM =====
const alertContainer = document.getElementById('alertContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const tableContainer = document.getElementById('tableContainer');
const emptyState = document.getElementById('emptyState');
const contentCount = document.getElementById('contentCount');
const contentsTableBody = document.getElementById('contentsTableBody');

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('🚀 Inicializando Panel Admin CMS...');
    
    // Verificar autenticación
    if (!requireAuth()) {
        return;
    }
    
    // Exponer funciones globally para onclick handlers
    window.editContent = openEditContentModal;
    window.deleteContentPrompt = deleteContentPrompt;
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar contenidos
    loadContents();
    
    console.log('✅ Panel Admin CMS inicializado');
    console.log('📡 API URL:', API_URL);
    console.log('🔐 Token disponible:', !!getToken());
}


// ===== CARGA DE DATOS =====

/**
 * Carga todos los contenidos con los filtros actuales
 * Usa la función loadContent del servicio de contenido
 */
async function loadContents() {
    showLoading();
    contents = [];
    
    try {
        // Usar el import de content.js
        const items = await loadContent(currentFilters);
        contents = items;
        renderTable(items);
    } catch (error) {
        console.error('❌ Error cargando contenidos:', error.message);
        showAlert(`Error al cargar contenidos: ${error.message}`, 'danger');
        hideLoading();
    }
}


// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Filtros
    const filterType = document.getElementById('filterType');
    const filterPage = document.getElementById('filterPage');
    const filterActive = document.getElementById('filterActive');
    const btnClearFilters = document.getElementById('btnClearFilters');
    
    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterPage) filterPage.addEventListener('change', applyFilters);
    if (filterActive) filterActive.addEventListener('change', applyFilters);
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', clearFilters);
    }
    
    // Nuevo contenido
    const btnNewContent = document.getElementById('btnNewContent');
    const btnNewContentEmpty = document.getElementById('btnNewContentEmpty');
    if (btnNewContent) btnNewContent.addEventListener('click', openNewContentModal);
    if (btnNewContentEmpty) btnNewContentEmpty.addEventListener('click', openNewContentModal);
    
    // Guardar contenido (modal)
    const btnSaveContent = document.getElementById('btnSaveContent');
    if (btnSaveContent) {
        btnSaveContent.addEventListener('click', saveContent);
    }
    
    // Confirmar eliminación
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener('click', confirmDelete);
    }
    
    // Refresh
    const btnRefresh = document.getElementById('btnRefresh');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', loadContents);
    }
}




function applyFilters() {
    const filterType = document.getElementById('filterType');
    const filterPage = document.getElementById('filterPage');
    const filterActive = document.getElementById('filterActive');
    
    currentFilters = {
        type: filterType?.value || '',
        page: filterPage?.value || '',
        is_active: filterActive?.value || ''
    };
    
    loadContents();
}

function clearFilters() {
    currentFilters = { type: '', page: '', is_active: '' };
    
    const filterType = document.getElementById('filterType');
    const filterPage = document.getElementById('filterPage');
    const filterActive = document.getElementById('filterActive');
    
    if (filterType) filterType.value = '';
    if (filterPage) filterPage.value = '';
    if (filterActive) filterActive.value = '';
    
    loadContents();
}

// ===== RENDERIZADO =====

function renderTable(items) {
    if (!contentsTableBody) return;

    // 🧼 limpiar
    contentsTableBody.innerHTML = '';
    hideLoading();
    hideAllStates();

    // 🧠 estado vacío
    if (!Array.isArray(items) || items.length === 0) {
        showEmptyState(true);
        updateCount(0);
        return;
    }

    showTable();
    updateCount(items.length);

    items.forEach(item => {
        const tr = document.createElement('tr');

        // Estado
        const isActive = item.is_active !== false;
        const statusBadge = isActive
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-danger">Inactivo</span>';

        // Tipo
        const typeLabels = {
            news: '<span class="badge bg-primary">Noticia</span>',
            page: '<span class="badge bg-info">Página</span>',
            section: '<span class="badge bg-warning text-dark">Sección</span>',
            image: '<span class="badge bg-secondary">Imagen</span>'
        };

        const typeBadge = typeLabels[item.type] || '<span class="badge bg-light text-dark">Desconocido</span>';

        tr.innerHTML = `
            <td>${item.id ?? '?'}</td>
            <td>${typeBadge}</td>
            <td>${escapeHtml(item.page || '')}</td>
            <td><code>${escapeHtml(item.key || '')}</code></td>
            <td><strong>${escapeHtml(item.title || 'Sin título')}</strong></td>
            <td>${statusBadge}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary"
                        onclick="window.editContent(${item.id})"
                        title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger"
                        onclick="window.deleteContentPrompt(${item.id})"
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        contentsTableBody.appendChild(tr);
    });
}

function updateCount(count) {
    if (!contentCount) return;
    contentCount.textContent = `${count} contenido${count !== 1 ? 's' : ''}`;
}


// ===== MODAL DE CONTENIDO =====
function openNewContentModal() {
    // Limpiar formulario
    const form = document.getElementById('contentForm');
    if (form) form.reset();
    
    const contentId = document.getElementById('contentId');
    const modalTitle = document.getElementById('modalTitle');
    const contentIsActive = document.getElementById('contentIsActive');
    
    if (contentId) contentId.value = '';
    if (modalTitle) modalTitle.textContent = 'Nuevo Contenido';
    if (contentIsActive) contentIsActive.checked = true;
    
    // Mostrar modal
    const modalEl = document.getElementById('contentModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

async function openEditContentModal(id) {
    try {
        showLoading();
        
        const content = await getContent(id);
        
        // Llenar formulario
        document.getElementById('contentId').value = content.id || '';
        document.getElementById('contentType').value = content.type || '';
        document.getElementById('contentPage').value = content.page || '';
        document.getElementById('contentKey').value = content.key || '';
        document.getElementById('contentTitle').value = content.title || '';
        document.getElementById('contentBody').value = content.body || '';
        document.getElementById('contentImageUrl').value = content.image_url || '';
        document.getElementById('contentIsActive').checked = content.is_active !== false;
        
        // Actualizar título del modal
        document.getElementById('modalTitle').textContent = 'Editar Contenido';
        
        // Mostrar modal
        const modalEl = document.getElementById('contentModal');
        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }
        
    } catch (error) {
        showAlert(`Error al obtener contenido: ${error.message}`, 'danger');
    } finally {
        hideLoading();
    }
}

// ===== CRUD OPERATIONS =====
async function saveContent() {
    // Validar formulario
    const contentType = document.getElementById('contentType').value;
    const contentPage = document.getElementById('contentPage').value;
    const contentKey = document.getElementById('contentKey').value;
    const contentTitle = document.getElementById('contentTitle').value;
    
    if (!contentType || !contentPage || !contentKey || !contentTitle) {
        showAlert('Por favor completa todos los campos obligatorios', 'warning');
        return;
    }
    
    // Recopilar datos del formulario
    const contentData = {
        type: contentType,
        page: contentPage,
        key: contentKey.trim(),
        title: contentTitle.trim(),
        body: document.getElementById('contentBody').value?.trim() || '',
        image_url: document.getElementById('contentImageUrl').value?.trim() || '',
        is_active: document.getElementById('contentIsActive').checked
    };
    
    try {
        const id = document.getElementById('contentId').value;
        
        if (id) {
            // Actualizar
            await updateContent(parseInt(id), contentData);
            showAlert('Contenido actualizado correctamente', 'success');
        } else {
            // Crear
            await createContent(contentData);
            showAlert('Contenido creado correctamente', 'success');
        }
        
        // Cerrar modal y recargar
        const modalEl = document.getElementById('contentModal');
        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
        
        loadContents();
        
    } catch (error) {
        console.error('❌ Error guardando contenido:', error.message);
        showAlert(`Error al guardar: ${error.message}`, 'danger');
    }
}

function deleteContentPrompt(id) {
    const content = contents.find(c => c.id === id);
    if (!content) {
        showAlert('Contenido no encontrado', 'danger');
        return;
    }
    
    contentToDelete = id;
    
    // Llenar información en modal de confirmación
    document.getElementById('deleteContentType').textContent = content.type || '-';
    document.getElementById('deleteContentPage').textContent = content.page || '-';
    document.getElementById('deleteContentTitle').textContent = content.title || '-';
    
    // Mostrar modal de confirmación
    const deleteModalEl = document.getElementById('deleteModal');
    if (deleteModalEl) {
        const deleteModal = new bootstrap.Modal(deleteModalEl);
        deleteModal.show();
    }
}

async function confirmDelete() {
    if (!contentToDelete) return;
    
    try {
        showLoading();
        
        await deleteContent(parseInt(contentToDelete));
        
        showAlert('Contenido eliminado correctamente', 'success');
        
        // Cerrar modal de confirmación
        const deleteModalEl = document.getElementById('deleteModal');
        if (deleteModalEl) {
            const deleteModal = bootstrap.Modal.getInstance(deleteModalEl);
            if (deleteModal) deleteModal.hide();
        }
        
        // Recargar lista
        loadContents();
        
    } catch (error) {
        console.error('❌ Error eliminando contenido:', error.message);
        showAlert(`Error al eliminar: ${error.message}`, 'danger');
    } finally {
        hideLoading();
        contentToDelete = null;
    }
}

// ===== ALERTAS =====
function showAlert(message, type = 'info') {
    if (!alertContainer) return;
    
    // Tipos de alertas Bootstrap
    const alertClasses = {
        'success': 'alert-success',
        'danger': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    };
    
    const alertClass = alertClasses[type] || 'alert-info';
    
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            <i class="fas fa-info-circle me-2"></i>
            ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHtml;
    alertContainer.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos para alertas de éxito
    if (type === 'success') {
        setTimeout(() => {
            const alert = alertContainer.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

// ===== ESTADOS DE VISTA =====
function showLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    if (alertContainer) alertContainer.style.display = 'none';
}

function hideLoading() {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
}

function showTable() {
    if (tableContainer) tableContainer.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
}

function showEmptyState(show = true) {
    if (emptyState) emptyState.style.display = show ? 'block' : 'none';
    if (tableContainer) tableContainer.style.display = show ? 'none' : 'block';
}

function hideAllStates() {
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
}

// ===== UTILIDADES =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Log de inicialización
console.log('✅ Admin JS cargado correctamente');
console.log('📡 API URL:', API_URL);
console.log('🔐 Token disponible:', !!getToken());

