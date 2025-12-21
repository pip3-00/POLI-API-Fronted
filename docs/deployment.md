# Guía de Deployment - Politécnico Ann y Ted Kheel

Esta guía cubre diferentes opciones para deployar el sitio web del Politécnico Ann y Ted Kheel.

## 🌐 Opciones de Hosting

### 1. Frontend (Sitio Web Estático)

#### **Netlify** (Recomendado para Frontend)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login a Netlify
netlify login

# 3. Deploy desde la carpeta frontend
cd frontend
netlify deploy --prod --dir=.

# 4. Configurar redirects (crear archivo _redirects en frontend)
echo "/* /index.html 200" > _redirects
```

#### **Vercel**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel --prod
```

#### **GitHub Pages**

```bash
# 1. Subir contenido de frontend a branch gh-pages
git checkout -b gh-pages
cp -r frontend/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

### 2. Backend (API)

#### **Heroku**

```bash
# 1. Crear Procfile en backend/
echo "web: uvicorn main:app --host 0.0.0.0 --port \${PORT:-8000}" > backend/Procfile

# 2. Crear runtime.txt en backend/
echo "python-3.13.0" > backend/runtime.txt

# 3. Deploy
cd backend
heroku create poli-pi-api
git subtree push --prefix backend heroku main
```

#### **Railway**

```bash
# 1. Conectar repositorio en railway.app
# 2. Seleccionar carpeta backend/
# 3. Variables de entorno automáticamente detectadas
```

#### **Render**

```bash
# 1. Conectar repositorio en render.com
# 2. Crear Web Service desde backend/
# 3. Build command: pip install -r requirements.txt
# 4. Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 🏗️ Deployment Completo (Frontend + Backend)

### Opción 1: Render (Recomendado)

1. **Backend**: Deploy desde carpeta `backend/`
2. **Frontend**: Deploy desde carpeta `frontend/`
3. **Variables de entorno**:
   ```
   API_BASE_URL=https://tu-backend.onrender.com
   ```

### Opción 2: Railway

1. **Backend**: Deploy automático desde `backend/`
2. **Frontend**: Deploy desde `frontend/` como sitio estático
3. **Conectar**: URL del backend en variables del frontend

## 🔧 Configuración de Variables de Entorno

### Frontend (.env)

```env
VITE_API_BASE_URL=https://tu-backend-url.com
VITE_SITE_NAME=Politécnico Ann y Ted Kheel
VITE_CONTACT_EMAIL=info@politecnico.edu.do
```

### Backend (.env)

```env
DATABASE_URL=postgresql://...
SECRET_KEY=tu-clave-secreta
DEBUG=False
CORS_ORIGINS=https://tu-frontend-url.com
```

## 📊 Configuración de Base de Datos (Opcional)

### PostgreSQL en Railway

```bash
# 1. Crear base de datos PostgreSQL
railway add postgresql

# 2. Obtener URL de conexión
railway variables

# 3. Actualizar backend para usar base de datos
pip install psycopg2-binary sqlalchemy
```

### SQLite (Desarrollo)

```python
# En main.py
from sqlalchemy import create_engine
engine = create_engine("sqlite:///./poli.db")
```

## 🔒 Configuración de Seguridad

### HTTPS y SSL

- Todos los proveedores recomendados incluyen SSL automático
- Configurar redirects HTTP → HTTPS

### CORS

```python
# En backend/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-frontend-url.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📈 Monitoring y Analytics

### Aplicación Web

- **Netlify Analytics**: Incluido automáticamente
- **Google Analytics**: Agregar código de tracking en HTML

### API Monitoring

- **UptimeRobot**: Monitoreo de disponibilidad
- **Sentry**: Tracking de errores
- **LogRocket**: Debugging en producción

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: "./frontend"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📱 Optimización de Performance

### Frontend

- **Compresión**: Gzip/Brotli habilitado
- **CDN**: Imágenes servidas desde CDN
- **Lazy Loading**: Imágenes cargadas bajo demanda
- **Minificación**: CSS/JS minificados en producción

### Backend

- **Cache**: Redis para cache de respuestas
- **Database**: Índices optimizados
- **API**: Rate limiting implementado

## 🔄 Backup y Recovery

### Base de Datos

```bash
# Backup automático diario
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Archivos Estáticos

- **Versionado**: Usar git para tracking de cambios
- **Backup**: S3 o similar para archivos de usuario

## 📞 Troubleshooting

### Problemas Comunes

**1. CORS Errors**

```javascript
// Verificar que el frontend use la URL correcta del backend
const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:8000";
```

**2. Build Failures**

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install

rm -rf backend/venv
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

**3. Performance Issues**

- Verificar que las imágenes estén optimizadas
- Comprobar que no hay memory leaks en JavaScript
- Monitorear uso de CPU/memoria del backend

## 📋 Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] URLs actualizadas en código
- [ ] SSL/HTTPS configurado
- [ ] CORS configurado correctamente
- [ ] Base de datos migrada
- [ ] Tests ejecutados exitosamente
- [ ] Monitoring configurado
- [ ] Backup automático habilitado
- [ ] Documentación actualizada

---

Para soporte adicional, contactar al equipo de desarrollo o revisar la documentación de cada proveedor de hosting.
