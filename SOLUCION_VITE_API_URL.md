# 🔧 Solución: VITE_API_URL No Funciona en Vercel

## Problema Común

La variable `VITE_API_URL` no se está usando correctamente en Vercel.

## Soluciones

### ✅ Solución 1: Verificar que la Variable Esté Configurada Correctamente

1. **En Vercel Dashboard:**
   - Ve a tu proyecto → **Settings** → **Environment Variables**
   - Verifica que exista:
     - **Key:** `VITE_API_URL` (exactamente así, con mayúsculas)
     - **Value:** `https://tu-backend.onrender.com` (sin barra al final)
     - **Environments:** Todas marcadas (Production, Preview, Development)

2. **IMPORTANTE:** Después de agregar/modificar variables de entorno, **DEBES redesplegar:**
   - Ve a **Deployments**
   - Click en los tres puntos (⋯) del último deployment
   - **Redeploy**

### ✅ Solución 2: Verificar el Formato de la URL

La URL debe ser:
- ✅ **Correcto:** `https://viajeia-backend.onrender.com`
- ❌ **Incorrecto:** `https://viajeia-backend.onrender.com/` (con barra al final)
- ❌ **Incorrecto:** `http://viajeia-backend.onrender.com` (sin https)
- ❌ **Incorrecto:** `https://viajeia-backend.onrender.com/api` (no incluyas /api)

### ✅ Solución 3: Verificar en la Consola del Navegador

1. Abre tu aplicación en Vercel
2. Abre las **Developer Tools** (F12)
3. Ve a la pestaña **Console**
4. Deberías ver: `🔧 API Base URL: https://tu-backend.onrender.com`
5. Si ves `http://localhost:8000`, la variable no se está cargando

### ✅ Solución 4: Forzar Rebuild Completo

1. En Vercel, ve a **Settings** → **General**
2. Scroll hasta **"Build & Development Settings"**
3. Click en **"Clear Build Cache"**
4. Luego ve a **Deployments** y haz **Redeploy**

### ✅ Solución 5: Verificar que el Build Use la Variable

Vercel debe mostrar en los logs del build algo como:
```
VITE_API_URL=https://tu-backend.onrender.com
```

Si no aparece, la variable no se está inyectando.

## Pasos de Verificación Completa

### 1. Verifica la Variable en Vercel
```
Settings → Environment Variables
- Key: VITE_API_URL
- Value: https://tu-backend.onrender.com
- Environments: ✅ Production ✅ Preview ✅ Development
```

### 2. Verifica el Backend en Render
- Ve a https://dashboard.render.com
- Tu servicio debe estar "Live" (verde)
- Copia la URL exacta

### 3. Redespliega en Vercel
```
Deployments → ⋯ → Redeploy
```

### 4. Verifica en el Navegador
- Abre la consola (F12)
- Busca el mensaje: `🔧 API Base URL:`
- Debe mostrar la URL de Render, NO localhost

## Solución Alternativa: Usar Archivo .env.production

Si las variables de entorno no funcionan, puedes crear un archivo:

1. **Crea `frontend/.env.production`:**
   ```
   VITE_API_URL=https://tu-backend.onrender.com
   ```

2. **Agrega al .gitignore:**
   ```
   .env.production
   ```

3. **PERO:** Esto no es ideal porque tendrías que commitear la URL. Mejor usa las variables de Vercel.

## Debug Avanzado

Si nada funciona, agrega esto temporalmente en `App.jsx` para ver qué está pasando:

```javascript
console.log('=== DEBUG ENV ===')
console.log('import.meta.env:', import.meta.env)
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('API_BASE_URL:', API_BASE_URL)
```

Esto te mostrará en la consola del navegador qué valores se están usando.

## Checklist Final

- [ ] Variable `VITE_API_URL` existe en Vercel
- [ ] Valor es la URL completa de Render (con https://)
- [ ] Está marcada para todos los ambientes
- [ ] Redesplegaste después de agregar/modificar
- [ ] El backend en Render está "Live"
- [ ] La consola del navegador muestra la URL correcta
- [ ] No hay errores de CORS en la consola

## Si Nada Funciona

1. **Verifica los logs del build en Vercel:**
   - Ve a **Deployments** → Click en el deployment
   - Revisa los "Build Logs"
   - Busca si hay errores relacionados con variables de entorno

2. **Prueba con una variable de prueba:**
   - Agrega `VITE_TEST=hola` en Vercel
   - En el código: `console.log(import.meta.env.VITE_TEST)`
   - Si esto funciona, el problema es específico de `VITE_API_URL`

3. **Contacta soporte de Vercel:**
   - Si nada funciona, puede ser un problema del lado de Vercel

