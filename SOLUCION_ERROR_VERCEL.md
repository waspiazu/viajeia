# 🔧 Solución: Error "No se pudo conectar con el servidor" en Vercel

## Problema

Tu aplicación en Vercel muestra el error:
```
No se pudo conectar con el servidor. Por favor, verifica que el backend esté corriendo en http://localhost:8000
```

## Causa

La variable de entorno `VITE_API_URL` no está configurada en Vercel, por lo que está usando el valor por defecto (`http://localhost:8000`).

## Solución Paso a Paso

### Paso 1: Verifica que tu Backend esté Desplegado en Render

1. Ve a https://dashboard.render.com
2. Verifica que tu servicio de backend esté corriendo (debe mostrar "Live" en verde)
3. Si no está desplegado, sigue la guía `GUIA_DESPLIEGUE_VERCEL.md` para desplegarlo primero
4. Copia la URL de tu backend (ej: `https://viajeia-backend.onrender.com`)

### Paso 2: Configura la Variable de Entorno en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `viajeia` (o el nombre que le hayas puesto)
3. Click en **"Settings"** (en la barra superior)
4. En el menú lateral, click en **"Environment Variables"**
5. Click en **"Add New"**
6. Completa:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://viajeia-backend.onrender.com` (reemplaza con tu URL real de Render)
   - **Environments:** Marca las tres opciones:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
7. Click en **"Save"**

### Paso 3: Redespliega la Aplicación

1. Ve a la pestaña **"Deployments"** (en la barra superior)
2. Encuentra el último deployment
3. Click en los **tres puntos** (⋯) a la derecha
4. Selecciona **"Redeploy"**
5. Confirma el redespliegue
6. Espera 2-3 minutos a que termine

### Paso 4: Verifica que Funcione

1. Una vez que termine el redespliegue, visita tu aplicación en Vercel
2. Intenta hacer una consulta
3. Debería funcionar correctamente ahora

## Verificación Rápida

Para verificar que la variable está configurada:

1. En Vercel, ve a **Settings** → **Environment Variables**
2. Deberías ver `VITE_API_URL` listada
3. El valor debe ser la URL de tu backend en Render (NO `http://localhost:8000`)

## Si el Backend Aún No Está Desplegado

Si aún no has desplegado el backend en Render:

1. Sigue la guía `GUIA_DESPLIEGUE_VERCEL.md`
2. Despliega primero el backend en Render
3. Luego configura la variable `VITE_API_URL` en Vercel con la URL de Render
4. Finalmente, redespliega el frontend

## Nota Importante

- **NO uses `http://localhost:8000`** en producción
- **SÍ usa la URL de Render** (ej: `https://viajeia-backend.onrender.com`)
- La variable `VITE_API_URL` debe estar configurada en **todos los ambientes** (Production, Preview, Development)

## ¿Aún No Funciona?

Si después de seguir estos pasos aún no funciona:

1. Verifica que el backend en Render esté corriendo (debe mostrar "Live")
2. Prueba acceder directamente a la URL del backend: `https://tu-backend.onrender.com/docs`
3. Deberías ver la documentación de FastAPI
4. Si no ves la documentación, el backend no está funcionando correctamente
5. Revisa los logs en Render para ver qué error tiene

