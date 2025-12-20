# Politécnico Ann y Ted Kheel - Sitio Web Oficial

Un sitio web moderno y responsive para el Politécnico Ann y Ted Kheel, desarrollado con tecnologías web actuales y una arquitectura de frontend-backend.

## 🚀 Características

- **Frontend Responsive**: HTML5, CSS3, JavaScript vanilla con Bootstrap 5
- **Backend API**: Python con FastAPI para funcionalidades dinámicas
- **Galería Interactiva**: Lightbox con navegación de imágenes
- **Sistema de Comentarios**: Formulario funcional para comentarios de visitantes
- **Noticias y Eventos**: Sistema de gestión de contenido dinámico
- **Optimizado para SEO**: Meta tags y estructura semántica
- **Accesibilidad**: Cumple con estándares de accesibilidad web

## 🛠️ Tecnologías Utilizadas

### Frontend

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript**: Interactividad y funcionalidades dinámicas
- **Bootstrap 5**: Framework CSS para diseño responsive
- **Font Awesome**: Iconografía moderna

### Backend

- **Python 3.13+**: Lenguaje de programación
- **FastAPI**: Framework web moderno y rápido
- **Uvicorn**: Servidor ASGI para producción

## 📁 Estructura del Proyecto

```
poli-pi-website/
├── frontend/                 # Sitio web público
│   ├── index.html           # Página principal
│   ├── index.css            # Estilos principales
│   ├── app.js               # JavaScript principal
│   ├── imagenes/            # Recursos gráficos
│   │   ├── logo-poli.png
│   │   ├── poli-img-*.{png,jpeg}
│   │   └── ...
│   └── fuentes/             # Tipografías Poppins
│       └── Poppins/
├── backend/                 # API y servicios
│   ├── main.py             # Aplicación FastAPI
│   └── requirements.txt    # Dependencias Python
├── docs/                   # Documentación
│   ├── README.md
│   └── deployment.md
└── package.json           # Configuración del proyecto
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 16+ (para el frontend)
- Python 3.13+ (para el backend)

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/pip3-00/Portafolio.git
cd Portafolio/poli-pi-website
```

2. **Instalar dependencias del frontend**

```bash
npm install
```

3. **Instalar dependencias del backend**

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Ejecutar en Desarrollo

**Frontend (Puerto 3000)**

```bash
npm run dev
```

**Backend (Puerto 8000)**

```bash
npm run backend-dev
```

### Ejecutar en Producción

**Frontend**

```bash
npm start
```

**Backend**

```bash
npm run backend
```

## 📖 API Endpoints

El backend proporciona los siguientes endpoints:

- `GET /noticias` - Obtener todas las noticias
- `POST /eventos` - Crear un nuevo evento
- `GET /estudiantes` - Listar estudiantes
- `PUT /horarios` - Actualizar horarios

## 🎨 Secciones del Sitio

1. **Inicio**: Hero section con información institucional
2. **Vida Estudiantil**: Galería interactiva y carrusel de imágenes
3. **Noticias**: Sistema de noticias con filtros y búsqueda
4. **Contacto**: Información de contacto y formularios

## 📱 Características Responsive

- Diseño adaptable para móviles, tablets y desktop
- Navegación colapsable en dispositivos móviles
- Imágenes optimizadas para diferentes resoluciones
- Touch-friendly para dispositivos táctiles

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```
API_BASE_URL=http://localhost:8000
SITE_NAME=Politécnico Ann y Ted Kheel
```

### Personalización

- Editar `frontend/index.css` para cambiar estilos
- Modificar `frontend/index.html` para contenido
- Actualizar `backend/main.py` para funcionalidades API

## 🚀 Deployment

Ver [docs/deployment.md](docs/deployment.md) para instrucciones detalladas de deployment.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autor

**Daphne de Jesus**

- Desarrollo Full Stack
- Especializado en tecnologías web modernas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:

- Email: info@politecnico.edu.do
- Issues: [GitHub Issues](https://github.com/pip3-00/Portafolio/issues)

---

© 2025 Politécnico Ann y Ted Kheel. Todos los derechos reservados.
