# ViajeIA - Tu Asistente Personal de Viajes

Aplicación web moderna para planificación de viajes con arquitectura separada entre frontend (React) y backend (Python).

## Estructura del Proyecto

```
ViajeIA/
├── frontend/          # Aplicación React con Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── backend/           # API Python con FastAPI
    ├── main.py
    └── requirements.txt
```

## Características

- ✨ Interfaz moderna y profesional con colores azules y blancos
- 🚀 Frontend construido con React y Vite
- 🐍 Backend con FastAPI (Python)
- 🤖 Integración con Google Gemini AI para respuestas inteligentes
- 🔄 Comunicación entre frontend y backend mediante API REST
- 📱 Diseño responsive

## Instalación y Uso

### Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Crea un entorno virtual (recomendado):
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instala las dependencias:
```bash
pip install -r requirements.txt
```

   **O usa el script de instalación automática (macOS/Linux):**
   ```bash
   ./install.sh
   ```

4. **Configura tus API Keys:**
   - Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:
   ```
   GEMINI_API_KEY=tu_api_key_aqui
   OPENWEATHER_API_KEY=tu_openweather_api_key_aqui
   UNSPLASH_ACCESS_KEY=tu_unsplash_access_key_aqui
   ```
   
   **API Key de Gemini:**
   - Obtén una API key gratuita en: https://makersuite.google.com/app/apikey
   - Reemplaza `tu_api_key_aqui` con tu API key de Gemini
   
   **API Key de OpenWeatherMap (para información del clima):**
   - Ve a https://openweathermap.org/api
   - Haz clic en "Sign Up" para crear una cuenta gratuita (no requiere tarjeta de crédito)
   - Una vez registrado, ve a "API Keys" en tu panel de control
   - Copia tu API key y reemplaza `tu_openweather_api_key_aqui` con ella
   - **Nota:** La API key gratuita permite 60 llamadas por minuto, más que suficiente para uso personal
   
   **API Key de Unsplash (para fotos de destinos):**
   - Ve a https://unsplash.com/developers
   - Haz clic en "Register as a developer" para crear una cuenta gratuita
   - Crea una nueva aplicación en "Your apps"
   - Copia tu "Access Key" y reemplaza `tu_unsplash_access_key_aqui` con ella
   - **Nota:** La API key gratuita permite 50 llamadas por hora, más que suficiente para uso personal

5. Inicia el servidor:
```bash
uvicorn main:app --reload --port 8000
```

El backend estará disponible en `http://localhost:8000`

### Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Uso

1. Asegúrate de que ambos servidores estén corriendo (backend en puerto 8000, frontend en puerto 3000)
2. Abre tu navegador en `http://localhost:3000`
3. Escribe tu pregunta sobre viajes en el campo de texto
4. Haz clic en "Planificar mi viaje" para obtener una respuesta

## Tecnologías Utilizadas

- **Frontend:**
  - React 18
  - Vite
  - Axios
  - CSS3

- **Backend:**
  - FastAPI
  - Python 3
  - Uvicorn
  - Pydantic
  - Google Generative AI (Gemini)
  - OpenWeatherMap API (clima)
  - Unsplash API (fotos)
  - python-dotenv
  - requests

## Configuración de APIs

### Google Gemini AI

Esta aplicación usa Google Gemini AI para generar respuestas inteligentes sobre viajes. Para obtener tu API key:

1. Visita: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la API key y pégala en el archivo `.env` del backend

**Nota:** La API key es gratuita y tiene límites generosos para uso personal.

### OpenWeatherMap API

La aplicación obtiene automáticamente el clima actual cuando mencionas un destino. Para obtener tu API key:

1. Visita: https://openweathermap.org/api
2. Haz clic en "Sign Up" para crear una cuenta gratuita
3. Completa el registro (no requiere tarjeta de crédito)
4. Una vez registrado, ve a tu panel de control
5. Navega a la sección "API Keys"
6. Copia tu API key (puede tardar unos minutos en activarse)
7. Pégala en el archivo `.env` del backend como `OPENWEATHER_API_KEY`

**Nota:** 
- La cuenta gratuita permite 60 llamadas por minuto
- La API key puede tardar 10-60 minutos en activarse después del registro
- Si no configuras esta API key, la aplicación funcionará normalmente pero sin información del clima

### Unsplash API

La aplicación muestra automáticamente 3 fotos hermosas del destino cuando se menciona una ciudad. Para obtener tu API key:

1. Visita: https://unsplash.com/developers
2. Haz clic en "Register as a developer" para crear una cuenta gratuita
3. Completa el registro (no requiere tarjeta de crédito)
4. Una vez registrado, ve a "Your apps" en tu panel de control
5. Haz clic en "New Application"
6. Completa el formulario (puedes usar cualquier nombre y descripción)
7. Acepta los términos de uso
8. Copia tu "Access Key" (no el Secret Key)
9. Pégala en el archivo `.env` del backend como `UNSPLASH_ACCESS_KEY`

**Nota:**
- La cuenta gratuita permite 50 llamadas por hora
- Las fotos se obtienen automáticamente cuando mencionas un destino
- Si no configuras esta API key, la aplicación funcionará normalmente pero sin fotos

## Solución de Problemas

### Error al instalar dependencias (pydantic-core)

Si encuentras un error relacionado con `pydantic-core` o `maturin` durante la instalación, es probable que estés usando Python 3.14 o una versión muy nueva. 

**Solución recomendada:** Usa Python 3.11 o 3.12 que tienen mejor compatibilidad:

1. Instala Python 3.11 o 3.12 (puedes usar pyenv o descargarlo desde python.org)
2. Crea un nuevo entorno virtual con esa versión:
   ```bash
   python3.11 -m venv venv  # o python3.12
   source venv/bin/activate
   ```
3. Actualiza pip:
   ```bash
   pip install --upgrade pip
   ```
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

**Alternativa rápida:** Si prefieres usar tu versión actual de Python, puedes intentar:
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Error de API Key no encontrada

Si ves un mensaje de advertencia sobre la API key:
- Asegúrate de haber creado el archivo `.env` en la carpeta `backend/`
- Verifica que el archivo contenga exactamente: `GEMINI_API_KEY=tu_api_key_aqui`
- No dejes espacios alrededor del signo `=`

### Error: "models/gemini-pro is not found"

Si ves este error, significa que el modelo `gemini-pro` ya no está disponible. El código ahora intenta automáticamente con modelos más recientes:
- `gemini-1.5-flash` (más rápido)
- `gemini-1.5-pro` (más potente)

Si el error persiste:
1. Verifica que tu API key sea válida y tenga acceso a los modelos de Gemini
2. Asegúrate de tener la última versión de `google-generativeai`:
   ```bash
   pip install --upgrade google-generativeai
   ```
3. El código intentará automáticamente diferentes modelos y te mostrará cuáles están disponibles si todos fallan

## Próximos Pasos

- Base de datos para almacenar historial de consultas
- Autenticación de usuarios
- Integración con APIs de viajes reales
- Mejoras en el prompt de Gemini para respuestas más específicas

