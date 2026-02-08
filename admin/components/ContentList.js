import { loadContent } from '../services/content.js';

class ContentListComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.state = {
      contents: [],
      loading: true, // Iniciar en loading true
      error: null,
      limit: 10,
      offset: 0,
      total: 0,
    };
  }

  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.render();
  }

  async fetchContents() {
    console.log('📄 Iniciando fetch de contenidos...');
    this.setState({ loading: true, error: null });

    try {
      const data = await loadContent({
        limit: this.state.limit,
        offset: this.state.offset
      });

      console.log("DATA RECIBIDA →", data);
      console.log('📦 Contenidos recibidos:', data.contenidos);

      // 🔑 CORRECCIÓN: Usar contenidos (con "i") no contents
      // Siempre devolver un array con ?? []
      const contenidos = data.contenidos ?? [];

      this.setState({
        contents: contenidos,
        total: data.total ?? 0,
        loading: false,
      });

    } catch (err) {
      console.error('❌ Error en fetchContents:', err);
      this.setState({ error: err.message, loading: false });
    }
  }

render() {
  const container = document.getElementById(this.containerId);
  if (!container) return;

  // LOADING
  if (this.state.loading) {
    container.innerHTML = `
      <div class="loading-state" style="padding:40px;text-align:center;">
        <div class="spinner"></div>
        <p>Cargando contenidos…</p>
      </div>
    `;
    return;
  }

  // ERROR
  if (this.state.error) {
    container.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <p>❌ Error: ${this.state.error}</p>
        <button onclick="location.reload()">Reintentar</button>
      </div>
    `;
    return;
  }

  // VACÍO
  if (this.state.contents.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #666;">
        <p>📭 No hay contenidos disponibles</p>
      </div>
    `;
    return;
  }

  // LISTA
  container.innerHTML = '';

  this.state.contents.forEach(item => {
    const div = document.createElement('div');
    div.className = 'content-item';
    div.innerHTML = `
      <strong>${item.type}</strong> — ${item.page}
    `;
    container.appendChild(div);
  });
}


  mount() {
    this.fetchContents();
  }

  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = '';
  }
}

let instance = null;

export function initContentsComponent() {
  instance = new ContentListComponent('contentListContainer');
  instance.mount();
}

export function destroyContentsComponent() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}

