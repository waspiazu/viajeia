# Cómo Obtener tu API Key de Unsplash

Unsplash es un servicio gratuito que proporciona fotos de alta calidad. Esta guía te ayudará a obtener tu API key en menos de 5 minutos.

## Pasos para Obtener tu API Key

### 1. Visita el sitio de desarrolladores de Unsplash
Ve a: **https://unsplash.com/developers**

### 2. Crea una cuenta gratuita
- Haz clic en el botón **"Register as a developer"** (Registrarse como desarrollador)
- O ve directamente a: **https://unsplash.com/join**

### 3. Completa el registro
- **Email**: Ingresa tu correo electrónico
- **Password**: Crea una contraseña segura
- **Full name**: Tu nombre completo
- Acepta los términos y condiciones
- Haz clic en **"Create account"**

### 4. Verifica tu correo electrónico
- Revisa tu bandeja de entrada
- Haz clic en el enlace de verificación que te enviaron por correo
- Esto activará tu cuenta

### 5. Crea una nueva aplicación
- Una vez verificado, inicia sesión en: **https://unsplash.com/developers**
- En el menú, ve a **"Your apps"** o directamente a: **https://unsplash.com/developers/apps**
- Haz clic en **"New Application"**

### 6. Completa el formulario de la aplicación
- **Application name**: Puedes usar cualquier nombre, por ejemplo "ViajeIA" o "Mi Asistente de Viajes"
- **Description**: Describe brevemente tu aplicación, por ejemplo "Aplicación para planificar viajes"
- Acepta los términos de uso de la API
- Haz clic en **"Create application"**

### 7. Obtén tu Access Key
- Una vez creada la aplicación, verás tu **"Access Key"** y **"Secret Key"**
- **IMPORTANTE**: Solo necesitas copiar el **"Access Key"** (no el Secret Key)
- El Access Key es una cadena larga de letras y números

### 8. Configura la API Key en tu proyecto
- Abre el archivo `.env` en la carpeta `backend/`
- Agrega o actualiza la línea:
  ```
  UNSPLASH_ACCESS_KEY=tu_access_key_copiada_aqui
  ```
- Reemplaza `tu_access_key_copiada_aqui` con el Access Key que copiaste

## Límites de la Cuenta Gratuita

La cuenta gratuita de Unsplash incluye:
- ✅ **50 llamadas por hora** (más que suficiente para uso personal)
- ✅ Acceso a millones de fotos de alta calidad
- ✅ Sin tarjeta de crédito requerida
- ✅ Sin costo

## Verificar que Funciona

Una vez configurada la API key, puedes probar que funciona:

1. Reinicia el servidor backend
2. Haz una pregunta sobre un destino, por ejemplo: "¿Qué puedo hacer en París?"
3. Si la API key está configurada correctamente, verás 3 fotos hermosas del destino al inicio de la respuesta

## Solución de Problemas

### Error: "Invalid API key" o "Unauthorized"
- Verifica que copiaste el **Access Key** (no el Secret Key)
- Asegúrate de que la API key esté en el archivo `.env` como `UNSPLASH_ACCESS_KEY=...`
- Verifica que no haya espacios antes o después de la API key

### No aparecen fotos
- Verifica que la API key esté correctamente configurada en el archivo `.env`
- Asegúrate de haber reiniciado el servidor después de agregar la API key
- Verifica que el nombre de la ciudad esté bien escrito
- Revisa la consola del servidor para ver si hay errores

### Límite de llamadas excedido
- La cuenta gratuita permite 50 llamadas por hora
- Si excedes el límite, espera una hora y vuelve a intentar
- Considera hacer menos preguntas o esperar entre consultas

## Alternativas

Si prefieres no usar Unsplash, la aplicación funcionará normalmente sin la API key, simplemente no mostrará fotos de los destinos.






