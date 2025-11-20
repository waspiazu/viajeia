# Cómo Obtener tu API Key de OpenWeatherMap

OpenWeatherMap es un servicio gratuito que proporciona información del clima en tiempo real. Esta guía te ayudará a obtener tu API key en menos de 5 minutos.

## Pasos para Obtener tu API Key

### 1. Visita el sitio de OpenWeatherMap
Ve a: **https://openweathermap.org/api**

### 2. Crea una cuenta gratuita
- Haz clic en el botón **"Sign Up"** (Registrarse) en la esquina superior derecha
- O ve directamente a: **https://home.openweathermap.org/users/sign_up**

### 3. Completa el formulario de registro
- **Username**: Elige un nombre de usuario
- **Email**: Ingresa tu correo electrónico
- **Password**: Crea una contraseña segura
- **First Name** y **Last Name**: Tu nombre completo
- Acepta los términos y condiciones
- Haz clic en **"Create Account"**

### 4. Verifica tu correo electrónico
- Revisa tu bandeja de entrada
- Haz clic en el enlace de verificación que te enviaron por correo
- Esto activará tu cuenta

### 5. Accede a tu API Key
- Una vez verificado, inicia sesión en: **https://home.openweathermap.org/**
- En el menú superior, ve a **"API keys"** o directamente a: **https://home.openweathermap.org/api_keys**
- Verás una API key predeterminada (llamada "Default")
- **Copia esta API key** (es una cadena larga de letras y números)

### 6. Configura la API Key en tu proyecto
- Abre el archivo `.env` en la carpeta `backend/`
- Agrega o actualiza la línea:
  ```
  OPENWEATHER_API_KEY=tu_api_key_copiada_aqui
  ```
- Reemplaza `tu_api_key_copiada_aqui` con la API key que copiaste

### 7. Espera la activación
- ⚠️ **IMPORTANTE**: La API key puede tardar entre **10-60 minutos** en activarse después del registro
- Si intentas usarla inmediatamente y no funciona, espera un poco y vuelve a intentar

## Límites de la Cuenta Gratuita

La cuenta gratuita de OpenWeatherMap incluye:
- ✅ **60 llamadas por minuto** (más que suficiente para uso personal)
- ✅ **1,000 llamadas por día**
- ✅ Acceso a datos del clima actual
- ✅ Sin tarjeta de crédito requerida
- ✅ Sin costo

## Verificar que Funciona

Una vez configurada la API key, puedes probar que funciona:

1. Reinicia el servidor backend
2. Haz una pregunta sobre un destino, por ejemplo: "¿Qué puedo hacer en París?"
3. Si la API key está configurada correctamente, verás información del clima al inicio de la respuesta

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste la API key completa sin espacios
- Asegúrate de que la API key esté en el archivo `.env` como `OPENWEATHER_API_KEY=...`
- Espera 10-60 minutos después del registro para que se active

### No aparece información del clima
- Verifica que la API key esté correctamente configurada en el archivo `.env`
- Asegúrate de haber reiniciado el servidor después de agregar la API key
- Verifica que el nombre de la ciudad esté bien escrito (usa nombres en inglés para mejor compatibilidad)

### La API key no se activa
- Revisa tu correo electrónico para confirmar que verificaste tu cuenta
- Intenta generar una nueva API key desde el panel de control
- Contacta al soporte de OpenWeatherMap si el problema persiste

## Alternativas

Si prefieres no usar OpenWeatherMap, la aplicación funcionará normalmente sin la API key, simplemente no mostrará información del clima.









