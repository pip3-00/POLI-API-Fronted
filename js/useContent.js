/**
 * Custom Hook para manejo de estados (React-like patterns)
 * Politécnico Ann y Ted Kheel
 */

/**
 * Crea un estado simple con setter - funciona como useState de React
 * @param {*} initialValue - Valor inicial del estado
 * @returns {Array} [state, setState]
 */
export function createState(initialValue) {
    let value = initialValue;
    const listeners = new Set();

    const getValue = () => value;
    const setValue = (newValue) => {
        value = newValue;
        listeners.forEach(listener => listener(value));
    };

    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return [getValue, setValue, subscribe];
}

/**
 * Hook personalizado para fetch de datos
 * Maneja automáticamente loading, error y datos
 * @param {string} url - Endpoint de la API
 * @param {Object} options - Opciones adicionales
 * @returns {Object} { data, loading, error, refetch }
 */
export function useFetch(url, options = {}) {
    const [data, setData, dataSubscribe] = createState([]);
    const [loading, setLoading, loadingSubscribe] = createState(false);
    const [error, setError, errorSubscribe] = createState(null);

    let isMounted = true;

    const fetchData = async () => {
        // Siempre resetear loading al iniciar
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const json = await response.json();

            // 🔑 EXTRACT CORRECTLY: data.contenidos (NO data directamente)
            const contenidos = json.contenidos ?? [];

            if (isMounted) {
                setData(contenidos);
                console.log('✅ Datos cargados correctamente:', contenidos);
            }
        } catch (err) {
            console.error('❌ Error en fetch:', err);
            if (isMounted) {
                setError(err.message);
            }
        } finally {
            // ✅ SIEMPRE se ejecuta, éxito o error
            if (isMounted) {
                setLoading(false);
                console.log('🔄 Fetch completado, loading = false');
            }
        }
    };

    // Efecto para cargar datos al montar
    if (options.immediate !== false) {
        fetchData();
    }

    // Cleanup al desmontar
    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}

/**
 * Componente base para renderizar listas
 * @param {string} containerId - ID del contenedor donde renderizar
 * @param {string} itemTemplateId - ID de la plantilla del item
 * @returns {Object} Render utilities
 */
export function createListRenderer(containerId, itemTemplateId) {
    const container = document.getElementById(containerId);
    const template = document.getElementById(itemTemplateId);

    if (!container) {
        console.error(`❌ No se encontró el contenedor: #${containerId}`);
        return null;
    }

    return {
        /**
         * Renderiza un array de items
         * @param {Array} items - Array de datos a renderizar
         * @param {Function} renderItem - Función que retorna HTML para cada item
         */
        render(items, renderItem) {
            if (!Array.isArray(items)) {
                console.error('❌ items debe ser un array, recibió:', typeof items);
                container.innerHTML = '<p class="error-message">Error: datos inválidos</p>';
                return;
            }

            container.innerHTML = '';

            if (items.length === 0) {
                container.innerHTML = '<p class="no-data-message">No hay contenidos disponibles</p>';
                return;
            }

            // ✅ USO CORRECTO: .map() sobre el array, no sobre el objeto
            items.forEach((item, index) => {
                try {
                    const html = renderItem(item, index);
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = html;
                    container.appendChild(wrapper.firstChild);
                } catch (err) {
                    console.error(`❌ Error renderizando item ${index}:`, err);
                }
            });
        },

        clear() {
            container.innerHTML = '';
        },

        showLoading() {
            container.innerHTML = `
                <div class="loading-container">
                    <div class="spinner"></div>
                    <p>Cargando contenidos...</p>
                </div>
            `;
        },

        showError(message) {
            container.innerHTML = `
                <div class="error-container">
                    <p class="error-message">Error: ${message}</p>
                    <button class="retry-btn" onclick="window.refetchContents()">Reintentar</button>
                </div>
            `;
        },

        showEmpty() {
            container.innerHTML = '<p class="no-data-message">No hay contenidos disponibles</p>';
        }
    };
}

/**
 * Factory para crear fetch handlers con estados
 * @param {Object} config - Configuración
 * @returns {Object} Handler con estados reactivos
 */
export function createContentHandler(config) {
    const {
        url = '/content',
        containerId = 'contents-container',
        loadingId = 'loading-indicator',
        errorId = 'error-message'
    } = config;

    // Estados (React-like)
    const [contents, setContents] = createState([]);
    const [loading, setLoading] = createState(true);
    const [error, setError] = createState(null);
    const [total, setTotal] = createState(0);

    // Referencias a elementos del DOM
    const container = document.getElementById(containerId);
    const loadingEl = document.getElementById(loadingId);
    const errorEl = document.getElementById(errorId);

    /**
     * Fetch con manejo correcto de estados
     * ✅ USA data.contenidos (NO data)
     */
    const fetchContents = async () => {
        console.log('📄 Iniciando fetch de contenidos...');

        // ✅ Siempre mostrar loading al iniciar
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // 🔑 PUNTO CRÍTICO: Extraer .contenidos del objeto
            // ✅ CORRECTO: setContents(data.contenidos)
            // ❌ INCORRECTO: setContents(data)
            const contenidos = data.contenidos ?? [];

            setContents(contenidos);
            setTotal(data.total ?? 0);

            console.log(`✅ Cargados ${contenidos.length} contenidos de ${data.total}`);

        } catch (err) {
            console.error('❌ Error fetching contents:', err);
            setError(err.message);
        } finally {
            // ✅ SIEMPRE se ejecuta: éxito O error
            // Esto asegura que el loading siempre se apague
            setLoading(false);
            console.log('🔄 Fetch terminado, loading = false');
        }
    };

    /**
     * Renderiza los contenidos en el DOM
     */
    const renderContents = () => {
        if (!container) {
            console.warn(`⚠️ Contenedor #${containerId} no encontrado`);
            return;
        }

        // Si está cargando, no mostrar nada o mostrar spinner
        if (loading()) {
            if (loadingEl) {
                loadingEl.style.display = 'block';
            }
            container.innerHTML = '';
            return;
        }

        // Ocultar loading
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }

        // Mostrar error si existe
        if (error()) {
            if (errorEl) {
                errorEl.textContent = `Error: ${error()}`;
                errorEl.style.display = 'block';
            }
            container.innerHTML = '';
            return;
        }

        // Ocultar error
        if (errorEl) {
            errorEl.style.display = 'none';
        }

        const items = contents();

        // ✅ VALIDACIÓN: Verificar que sea un array antes de usar .map()/.forEach()
        if (!Array.isArray(items)) {
            console.error('❌ contents() no es un array:', items);
            container.innerHTML = '<p class="error">Error: datos corruptos</p>';
            return;
        }

        // Renderizar lista
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<p class="no-data">No hay contenidos disponibles</p>';
            return;
        }

        // ✅ USO CORRECTO: forEach sobre el array
        items.forEach((item, index) => {
            try {
                const html = renderItemTemplate(item, index);
                const temp = document.createElement('div');
                temp.innerHTML = html;
                container.appendChild(temp.firstChild);
            } catch (err) {
                console.error(`❌ Error renderizando item ${index}:`, err);
            }
        });
    };

    /**
     * Plantilla para renderizar cada item
     * @param {Object} item - Datos del contenido
     * @param {number} index - Índice del item
     * @returns {string} HTML del item
     */
    const renderItemTemplate = (item, index) => {
        return `
            <div class="content-item" data-id="${item.id}">
                <h3>${escapeHtml(item.type || 'Sin título')}</h3>
                <p>Página: ${escapeHtml(item.page || 'N/A')}</p>
            </div>
        `;
    };

    /**
     * Escapa HTML para prevenir XSS
     */
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Suscribir a cambios para auto-render
    const unsubscribeContents = contents.subscribe(renderContents);
    const unsubscribeLoading = loading.subscribe(renderContents);
    const unsubscribeError = error.subscribe(renderContents);

    // Cleanup
    const cleanup = () => {
        unsubscribeContents();
        unsubscribeLoading();
        unsubscribeError();
    };

    // Exponer para window (para retry buttons)
    window.refetchContents = fetchContents;

    return {
        // Estados
        getContents: contents,
        getLoading: loading,
        getError: error,
        getTotal: total,

        // Métodos
        fetch: fetchContents,
        render: renderContents,
        cleanup,

        // Plantilla personalizable
        setItemTemplate: (fn) => { renderItemTemplate = fn; }
    };
}

console.log('✅ useContent.js cargado correctamente');

