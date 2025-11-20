# 🔧 Solución: Error CORS en Vercel

## Error que Estás Viendo

```
Access to XMLHttpRequest at 'https://viajeia-86y2.onrender.com/api/info-panel?ciudad=' 
from origin 'https://viajeia-eight.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Causa

El backend en Render no está permitiendo peticiones desde tu frontend en Vercel (`https://viajeia-eight.vercel.app`).

## Solución

He actualizado el código del backend para que automáticamente permita todos los orígenes cuando está en producción (Render).

### Opción 1: Usar la Configuración Automática (Recomendado)

El código ahora detecta automáticamente si está en producción y permite todos los orígenes. Solo necesitas:

1. **Subir los cambios al repositorio:**
   ```bash
   git add backend/main.py
   git commit -m "Fix: Permitir CORS para Vercel en producción"
   git push
   ```

2. **Render redesplegará automáticamente** cuando detecte el push

3. **Espera 5-10 minutos** para que Render termine el despliegue

4. **Prueba de nuevo** tu aplicación en Vercel

### Opción 2: Configurar Variable de Entorno en Render (Alternativa)

Si prefieres ser más específico, puedes configurar la variable de entorno en Render:

1. Ve a tu servicio en Render: https://dashboard.render.com
2. Click en tu servicio de backend
3. Ve a **Environment**
4. Agrega una nueva variable:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `https://viajeia-eight.vercel.app`
5. Guarda y reinicia el servicio

## Verificación

Después de que Render redespliegue:

1. Abre tu aplicación en Vercel
2. Abre la consola del navegador (F12)
3. Los errores de CORS deberían desaparecer
4. La aplicación debería funcionar correctamente

## Si Aún No Funciona

1. **Verifica que el backend esté corriendo:**
   - Ve a `https://viajeia-86y2.onrender.com/docs`
   - Deberías ver la documentación de FastAPI

2. **Verifica los logs en Render:**
   - Ve a tu servicio en Render
   - Click en "Logs"
   - Busca errores relacionados con CORS

3. **Espera un poco más:**
   - Render puede tardar unos minutos en aplicar los cambios
   - El servicio puede estar "despertando" si estaba dormido

## Nota Importante

- El código ahora permite **todos los orígenes** en producción por defecto
- Esto es seguro para una API pública
- Si quieres restringir a dominios específicos, usa la variable `ALLOWED_ORIGINS` en Render

