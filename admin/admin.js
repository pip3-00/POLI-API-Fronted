/**
 * PANEL DE ADMINISTRACIÓN - Politécnico Ann y Ted Kheel
 * Maneja la gestión completa de noticias del backend FastAPI
 * 
 * Funcionalidades:
 * - Protección de rutas con JWT
 * - CRUD completo de noticias
 * - Manejo de errores 401/403
 * - Interfaz responsiva con feedback visual
 */

// ===== CONFIGURACIÓN =====
const API_URL = window.CONFIG?.API_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'admin_token';

// ===== ELEMENTOS DEL DOM =====
let newsModal, deleteModal, alertContainer, newsTableBody, loadingSpinner, 
    tableContainer, emptyState, newsCount;

// ===== ESTADO =====
let currentNews = [];
let editingNewsId = null;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('═══════════════════════════════════════════');
    console.log('🚀 PANEL DE ADMIN INICIALIZADO');
    console.log('═══════════════════════════════════════════');
    
    // Verificar autenticación primero
    if (!checkAuth()) {
        redirectToLogin();
        return;
    }
    
    // Inicializar elementos del DOM
    initializeElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar noticias
    loadNews();
    
    console.log('✅ Panel de administración listo');
});

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
function checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const isAuth = !!token;
    
    if (!isAuth) {
        console.log('⚠️ No hay token - redirigiendo a login');
    } else {
        console.log('✅ Token encontrado - usuario autenticado');
    }
    
    return isAuth;
}

/**
 * Redirige a la página de login
 */
function redirectToLogin() {
    console.log('➡️ Redirigiendo a login.html...');
    window.location.href = 'login.html';
}

/**
 * Inicializa las referencias a elementos del DOM
 */
function initializeElements() {
    // Modales
    newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    
    // Elementos UI
    alertContainer = document.getElementById('alertContainer');
    newsTableBody = document.getElementById('newsTableBody');
    loadingSpinner = document.getElementById('loadingSpinner');
    tableContainer = document.getElementById('tableContainer');
    emptyState = document.getElementById('emptyState');
    newsCount = document.getElementById('newsCount');
    
    // Inputs del formulario
    document.getElementById('newsDate').valueAsDate = new Date();
    
    console.log('✅ Elementos del DOM inicializados');
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botón nueva noticia
    const btnNueva = document.getElementById('btnNuevaNoticia');
    const btnNuevaEmpty = document.getElementById('btnNuevaNoticiaEmpty');
    
    if (btnNueva) {
        btnNueva.addEventListener('click', () => openNewsModal());
    }
    if (btnNuevaEmpty) {
        btnNuevaEmpty.addEventListener('click', () => openNewsModal());
    }
    
    // Botón refresh
    const btnRefresh = document.getElementById('btnRefresh');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', loadNews);
    }
    
    // Guardar noticia
    const btnSave = document.getElementById('btnSaveNews');
    if (btnSave) {
        btnSave.addEventListener('click', saveNews);
    }
    
    // Confirmar eliminación
    const btnDelete = document.getElementById('btnConfirmDelete');
    if (btnDelete) {
        btnDelete.addEventListener('click', confirmDelete);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Resetear formulario al cerrar modal
    const newsModalEl = document.getElementById('newsModal');
    if (newsModalEl) {
        newsModalEl.addEventListener('hidden.bs.modal', () => {
            resetNewsForm();
        });
    }
    
    console.log('✅ Event listeners configurados');
}

/**
 * Obtiene el token del localStorage
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Crea los headers para requests autenticadas
 * @returns {Object}
 */
function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Maneja errores de autenticación (401, 403)
 */
function handleAuthError() {
    console.log('⚠️ Error de autenticación - cerrando sesión');
    showAlert('Tu sesión ha expirado o no tienes permisos. Serás redirigido al login.', 'warning');
    
    setTimeout(() => {
        logout();
    }, 2000);
}

/**
 * Carga todas las noticias desde el backend
 */
async function loadNews() {
    console.log('📰 Cargando noticias...');
    showLoading(true);
    hideEmptyState();
    
    try {
        const response = await fetch(`${API_URL}/news`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Normalizar datos (puede venir como array o como objeto con keys)
        if (Array.isArray(data)) {
            currentNews = data;
        } else if (typeof data === 'object') {
            // Si viene como objeto, intentar extraer array
            currentNews = data.data || data.news || Object.values(data).find(v => Array.isArray(v)) || [];
        } else {
            currentNews = [];
        }
        
        console.log(`✅ ${currentNews.length} noticias cargadas`);
        renderNewsTable();
        
    } catch (error) {
        console.error('❌ Error cargando noticias:', error);
        showAlert('Error al cargar las noticias. Por favor intenta de nuevo.', 'danger');
        showEmptyState();
    } finally {
        showLoading(false);
    }
}

/**
 * Renderiza la tabla de noticias
 */
function renderNewsTable() {
    const count = currentNews.length;
    newsCount.textContent = `${count} ${count === 1 ? 'noticia' : 'noticias'}`;
    
    if (count === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    // Ordenar por fecha (más recientes primero)
    const sortedNews = [...currentNews].sort((a, b) => {
        const dateA = new Date(a.created_at || a.date || a.published_at || 0);
        const dateB = new Date(b.created_at || b.date || b.published_at || 0);
        return dateB - dateA;
    });
    
    newsTableBody.innerHTML = sortedNews.map(news => `
        <tr data-id="${news.id}">
            <td class="text-center">
                <span class="badge bg-secondary">${news.id}</span>
            </td>
            <td class="news-title-cell" title="${escapeHtml(news.title)}">
                <strong>${escapeHtml(news.title)}</strong>
            </td>
            <td class="text-center">
                ${formatDate(news.created_at || news.date || news.published_at)}
            </td>
            <td class="text-center">
                <span class="badge ${news.published !== false ? 'badge-published' : 'badge-draft'}">
                    ${news.published !== false ? 'Publicado' : 'Borrador'}
                </span>
            </td>
            <td class="text-end">
                <button class="action-btn btn-edit" onclick="editNews(${news.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn btn-delete" onclick="deleteNews(${news.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre el modal para crear/editar noticia
 * @param {number|null} id - ID de la noticia a editar (null para nueva)
 */
function openNewsModal(id = null) {
    editingNewsId = id;
    const modalTitle = document.getElementById('modalTitle');
    const btnSaveText = document.getElementById('btnSaveText');
    
    if (id) {
        // Modo edición
        const news = currentNews.find(n => n.id === id);
        if (!news) {
            showAlert('No se encontró la noticia a editar.', 'danger');
            return;
        }
        
        modalTitle.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Noticia';
        btnSaveText.textContent = 'Actualizar';
        
        // Llenar formulario
        document.getElementById('newsId').value = news.id;
        document.getElementById('newsTitle').value = news.title || '';
        document.getElementById('newsCategory').value = news.category || '';
        document.getElementById('newsExcerpt').value = news.excerpt || news.summary || '';
        document.getElementById('newsContent').value = news.content || '';
        document.getElementById('newsImage').value = news.image || news.image_url || '';
        document.getElementById('newsAuthor').value = news.author || news.author_name || '';
        
        // Formatear fecha
        const newsDate = news.created_at || news.date || news.published_at;
        if (newsDate) {
            document.getElementById('newsDate').value = newsDate.split('T')[0];
        }
        
    } else {
        // Modo creación
        modalTitle.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Nueva Noticia';
        btnSaveText.textContent = 'Guardar';
        resetNewsForm();
    }
    
    newsModal.show();
}

/**
 * Resetea el formulario de noticias
 */
function resetNewsForm() {
    document.getElementById('newsForm').reset();
    document.getElementById('newsId').value = '';
    editingNewsId = null;
    document.getElementById('newsDate').valueAsDate = new Date();
}

/**
 * Guarda una noticia (crear o actualizar)
 */
async function saveNews() {
    console.log('💾 Guardando noticia...');
    
    // Validar formulario
    const form = document.getElementById('newsForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Recopilar datos
    const newsData = {
        title: document.getElementById('newsTitle').value.trim(),
        category: document.getElementById('newsCategory').value,
        excerpt: document.getElementById('newsExcerpt').value.trim(),
        content: document.getElementById('newsContent').value.trim(),
        date: document.getElementById('newsDate').value,
        image: document.getElementById('newsImage').value.trim(),
        author: document.getElementById('newsAuthor').value.trim()
    };
    
    // Campos opcionales
    if (!newsData.image) delete newsData.image;
    if (!newsData.author) delete newsData.author;
    
    const btnSave = document.getElementById('btnSaveNews');
    const originalText = btnSave.innerHTML;
    btnSave.disabled = true;
    btnSave.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    
    try {
        const url = editingNewsId 
            ? `${API_URL}/news/${editingNewsId}`
            : `${API_URL}/news`;
        
        const method = editingNewsId ? 'PUT' : 'POST';
        
        console.log(`📡 ${method} ${url}`);
        console.log('📦 Datos:', JSON.stringify(newsData, null, 2));
        
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(newsData)
        });
        
        // Manejar error de autenticación
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}`);
        }
        
        const savedNews = await response.json();
        console.log('✅ Noticia guardada:', savedNews);
        
        // Cerrar modal y recargar
        newsModal.hide();
        showAlert(
            editingNewsId ? 'Noticia actualizada correctamente.' : 'Noticia creada correctamente.',
            'success'
        );
        
        loadNews();
        
    } catch (error) {
        console.error('❌ Error guardando noticia:', error);
        showAlert(`Error al guardar: ${error.message}`, 'danger');
    } finally {
        btnSave.disabled = false;
        btnSave.innerHTML = originalText;
    }
}

/**
 * Prepara la eliminación de una noticia
 * @param {number} id
 */
function deleteNews(id) {
    const news = currentNews.find(n => n.id === id);
    if (!news) {
        showAlert('No se encontró la noticia.', 'danger');
        return;
    }
    
    document.getElementById('deleteNewsTitle').textContent = news.title;
    document.getElementById('btnConfirmDelete').dataset.id = id;
    deleteModal.show();
}

/**
 * Confirma y ejecuta la eliminación
 */
async function confirmDelete() {
    const btnDelete = document.getElementById('btnConfirmDelete');
    const id = btnDelete.dataset.id;
    
    if (!id) return;
    
    console.log(`🗑️ Eliminando noticia ID: ${id}`);
    
    btnDelete.disabled = true;
    btnDelete.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Eliminando...';
    
    try {
        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        // Manejar error de autenticación
        if (response.status === 401 || response.status === 403) {
            handleAuthError();
            return;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}`);
        }
        
        console.log('✅ Noticia eliminada');
        deleteModal.hide();
        showAlert('Noticia eliminada correctamente.', 'success');
        loadNews();
        
    } catch (error) {
        console.error('❌ Error eliminando noticia:', error);
        showAlert(`Error al eliminar: ${error.message}`, 'danger');
    } finally {
        btnDelete.disabled = false;
        btnDelete.innerHTML = '<i class="fas fa-trash me-1"></i>Eliminar';
    }
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem(TOKEN_KEY);
    console.log('✅ Token removido');
    window.location.href = 'login.html';
}

// ===== FUNCIONES AUXILIARES =====

/**
 * Muestra una alerta
 * @param {string} message
 * @param {string} type - 'success', 'danger', 'warning', 'info'
 */
function showAlert(message, type = 'info') {
    const icons = {
        success: 'fa-check-circle',
        danger: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas ${icons[type]} me-2"></i>
            ${escapeHtml(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alertContainer.style.display = 'block';
    
    // Auto-hide después de 5 segundos para alertas de éxito
    if (type === 'success') {
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 5000);
    }
}

/**
 * Muestra/oculta el loading
 * @param {boolean} show
 */
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
    tableContainer.style.display = show ? 'none' : 'none';
}

/**
 * Muestra el estado vacío
 */
function showEmptyState() {
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'none';
    emptyState.style.display = 'block';
}

/**
 * Oculta el estado vacío
 */
function hideEmptyState() {
    loadingSpinner.style.display = 'none';
    tableContainer.style.display = 'block';
    emptyState.style.display = 'none';
}

/**
 * Formatea una fecha
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch {
        return dateString;
    }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== EXPORTAR FUNCIONES GLOBALMENTE =====
// Estas funciones se llaman desde los botones onclick en el HTML
window.editNews = editNews;
window.deleteNews = deleteNews;
window.logout = logout;

console.log('✅ Admin JS cargado correctamente');
console.log('📡 API URL:', API_URL);

