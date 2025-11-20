# 🚀 Guía Rápida de Despliegue

## Resumen

Esta aplicación se despliega en dos partes:
- **Frontend (React + Vite):** Vercel (gratis)
- **Backend (FastAPI):** Render (gratis)

## Pasos Rápidos

### 1. Backend en Render

1. Sube tu código a GitHub
2. Ve a https://render.com y crea un Web Service
3. Conecta tu repositorio
4. Configura:
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Agrega variables de entorno:
   - `GEMINI_API_KEY`
   - `OPENWEATHER_API_KEY`
   - `UNSPLASH_ACCESS_KEY`
   - `ALLOWED_ORIGINS` = `https://tu-app.vercel.app` (después de desplegar el frontend)
6. Guarda la URL del backend (ej: `https://viajeia-backend.onrender.com`)

### 2. Frontend en Vercel

1. Ve a https://vercel.com y crea un proyecto
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
4. Agrega variable de entorno:
   - `VITE_API_URL` = URL de tu backend en Render
5. Despliega

## Documentación Completa

Lee el archivo `GUIA_DESPLIEGUE_VERCEL.md` para instrucciones detalladas paso a paso.

