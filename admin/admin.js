import { API_URL } from '../config.js';
import { loadContent } from './services/content.js';

console.log('🔥 admin.js EJECUTADO');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔥 DOMContentLoaded');
  await loadAdmin();
});

async function loadAdmin() {
  try {
    console.log('📡 Cargando datos del CMS...');

    const { contenidos, total } = await loadContent({ limit: 50 });

    console.log('📦 Contenidos:', contenidos);

    // Ocultar spinner siempre
    document.getElementById('loadingSpinner').style.display = 'none';

    if (contenidos.length === 0) {
      // Ocultar tabla, mostrar empty state, badge 0
      document.getElementById('tableContainer').style.display = 'none';
      document.getElementById('emptyState').style.display = 'block';
      document.getElementById('contentCount').textContent = '0 contenidos';
    } else {
      // Ocultar empty, mostrar tabla, renderizar filas, badge total
      document.getElementById('emptyState').style.display = 'none';
      document.getElementById('tableContainer').style.display = 'block';
      renderContents(contenidos);
      document.getElementById('contentCount').textContent = `${total} contenidos`;
    }
  } catch (err) {
    console.error('❌ Error cargando admin:', err);
  }
}

function renderContents(contents) {
  const tableBody = document.getElementById('contentsTableBody');
  tableBody.innerHTML = '';

  contents.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.type}</td>
      <td>${item.page}</td>
      <td>${item.key}</td>
      <td>${item.title}</td>
      <td>${item.is_active ? 'Sí' : 'No'}</td>
      <td class="text-end">—</td>
    `;
    tableBody.appendChild(tr);
  });
}

async function fetchAllContents(limit = 10, offset = 0) {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        console.error('⚠️ No hay token de admin, debes iniciar sesión');
        window.location.href = '../login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/content/admin/all?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 401) {
            console.error('❌ Token inválido o expirado');
            localStorage.removeItem('admin_token');
            window.location.href = '../login.html';
            return;
        }

        if (!response.ok) throw new Error(`Error al cargar contenidos: ${response.status}`);

        const data = await response.json();
        renderContentList(data);
    } catch (err) {
        console.error(err);
    }
}

// Ejecutar al cargar el panel
document.addEventListener('DOMContentLoaded', () => {
    fetchAllContents();
});
