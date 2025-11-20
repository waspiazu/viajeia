# 🚀 Guía Completa: Desplegar ViajeIA en Vercel (GRATIS)

Esta guía te ayudará a desplegar tu aplicación ViajeIA en internet de forma completamente gratuita usando Vercel (frontend) y Render (backend).

## 📋 Requisitos Previos

1. ✅ Cuenta de GitHub (gratis): https://github.com
2. ✅ Cuenta de Vercel (gratis): https://vercel.com
3. ✅ Cuenta de Render (gratis): https://render.com
4. ✅ Tu proyecto funcionando localmente

---

## 🎯 Parte 1: Desplegar el Backend en Render (GRATIS)

### Paso 1: Preparar el Backend

1. **Asegúrate de tener un archivo `.env` con tus API keys:**
   ```bash
   cd backend
   # Crea un archivo .env con:
   GEMINI_API_KEY=tu_clave_aqui
   OPENWEATHER_API_KEY=tu_clave_aqui
   UNSPLASH_ACCESS_KEY=tu_clave_aqui
   ```

2. **Crea un archivo `Procfile` en la raíz del backend:**
   ```bash
   cd backend
   echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
   ```

3. **Crea un archivo `runtime.txt` (opcional, para especificar versión de Python):**
   ```bash
   echo "python-3.12.0" > runtime.txt
   ```

### Paso 2: Subir el Código a GitHub

1. **Inicializa Git si no lo has hecho:**
   ```bash
   cd /Users/wilmaraspiazuhurtado/Documents/ViajeIA
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Crea un repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un nuevo repositorio (ej: `viajeia`)
   - **NO** inicialices con README, .gitignore o licencia

3. **Conecta tu repositorio local con GitHub:**
   ```bash
   git remote add origin https://github.com/TU_USUARIO/viajeia.git
   git branch -M main
   git push -u origin main
   ```

### Paso 3: Desplegar en Render

1. **Ve a Render.com y crea una cuenta:**
   - https://render.com
   - Inicia sesión con GitHub

2. **Crea un nuevo Web Service:**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `viajeia`

3. **Configura el servicio:**
   - **Name:** `viajeia-backend` (o el nombre que prefieras)
   - **Environment:** `Python 3`
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Selecciona "Free"

4. **Agrega las Variables de Entorno:**
   - En la sección "Environment Variables", agrega:
     - `GEMINI_API_KEY` = tu clave de Gemini
     - `OPENWEATHER_API_KEY` = tu clave de OpenWeatherMap
     - `UNSPLASH_ACCESS_KEY` = tu clave de Unsplash
     - `PORT` = `10000` (Render lo manejará automáticamente, pero puedes ponerlo)

5. **Despliega:**
   - Click en "Create Web Service"
   - Render comenzará a construir y desplegar tu backend
   - Espera 5-10 minutos para que termine

6. **Obtén la URL de tu backend:**
   - Una vez desplegado, verás una URL como: `https://viajeia-backend.onrender.com`
   - **¡Guarda esta URL!** La necesitarás para el frontend

---

## 🎨 Parte 2: Desplegar el Frontend en Vercel (GRATIS)

### Paso 1: Preparar el Frontend

1. **Actualiza la variable de entorno:**
   - En Vercel, configuraremos la variable `VITE_API_URL` con la URL de tu backend de Render

### Paso 2: Desplegar en Vercel

1. **Ve a Vercel.com:**
   - https://vercel.com
   - Inicia sesión con GitHub

2. **Importa tu proyecto:**
   - Click en "Add New..." → "Project"
   - Importa tu repositorio de GitHub
   - Selecciona el repositorio `viajeia`

3. **Configura el proyecto:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (debería detectarse automáticamente)
   - **Output Directory:** `dist` (debería detectarse automáticamente)
   - **Install Command:** `npm install` (debería detectarse automáticamente)

4. **Agrega Variables de Entorno:**
   - Click en "Environment Variables"
   - Agrega:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://viajeia-backend.onrender.com` (la URL de tu backend en Render)
     - Selecciona todos los ambientes (Production, Preview, Development)

5. **Despliega:**
   - Click en "Deploy"
   - Vercel comenzará a construir y desplegar tu frontend
   - Espera 2-3 minutos

6. **¡Listo!**
   - Una vez desplegado, Vercel te dará una URL como: `https://viajeia.vercel.app`
   - **¡Tu aplicación está en internet!** 🌍

---

## 🔧 Solución de Problemas

### El backend no inicia en Render

**Problema:** El servicio muestra "Build failed" o "Deploy failed"

**Solución:**
1. Verifica que el archivo `requirements.txt` esté en la carpeta `backend/`
2. Verifica que el `Start Command` sea correcto
3. Revisa los logs en Render para ver el error específico
4. Asegúrate de que todas las variables de entorno estén configuradas

### El frontend no puede conectar con el backend

**Problema:** Error "Failed to fetch" o "Network error"

**Solución:**
1. Verifica que la variable `VITE_API_URL` en Vercel tenga la URL correcta del backend
2. Asegúrate de que el backend en Render esté corriendo (puede tardar unos segundos en "despertar")
3. Verifica que el backend responda visitando: `https://tu-backend.onrender.com/docs`

### El backend se "duerme" en Render (Free Plan)

**Problema:** El backend tarda mucho en responder la primera vez

**Solución:**
- En el plan gratuito de Render, los servicios se "duermen" después de 15 minutos de inactividad
- La primera petición después de dormirse puede tardar 30-60 segundos
- Esto es normal en el plan gratuito
- Si necesitas que esté siempre activo, considera el plan de pago ($7/mes)

---

## 📝 Checklist Final

Antes de considerar que todo está listo, verifica:

- [ ] Backend desplegado en Render y funcionando
- [ ] Puedes acceder a `https://tu-backend.onrender.com/docs` y ver la documentación de FastAPI
- [ ] Frontend desplegado en Vercel
- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] Puedes acceder a tu aplicación en `https://tu-app.vercel.app`
- [ ] La aplicación puede hacer consultas al backend
- [ ] Las fotos se cargan correctamente
- [ ] El clima se muestra correctamente

---

## 🎉 ¡Felicidades!

Tu aplicación ViajeIA está ahora disponible en internet para que cualquier persona pueda usarla desde cualquier lugar del mundo.

**URLs importantes:**
- **Frontend:** `https://tu-app.vercel.app`
- **Backend API:** `https://tu-backend.onrender.com`
- **Documentación API:** `https://tu-backend.onrender.com/docs`

---

## 💡 Tips Adicionales

1. **Dominio Personalizado:**
   - Vercel permite agregar un dominio personalizado gratis
   - Ve a Settings → Domains en tu proyecto de Vercel

2. **Actualizaciones Automáticas:**
   - Cada vez que hagas `git push` a GitHub, Vercel y Render desplegarán automáticamente los cambios

3. **Monitoreo:**
   - Vercel te muestra estadísticas de uso y rendimiento
   - Render te muestra logs y métricas del backend

4. **Backup:**
   - Asegúrate de tener tus API keys guardadas de forma segura
   - Considera usar un gestor de contraseñas

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras algún problema:
1. Revisa los logs en Render (backend) y Vercel (frontend)
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el código funcione localmente primero

¡Buena suerte con tu despliegue! 🚀

