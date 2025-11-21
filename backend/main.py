from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
import requests
import re
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = FastAPI(title="ViajeIA API")

# Configurar Gemini con la API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("⚠️  ADVERTENCIA: GEMINI_API_KEY no encontrada. Asegúrate de crear un archivo .env con tu API key.")

# Configurar OpenWeatherMap
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

if not OPENWEATHER_API_KEY:
    print("⚠️  ADVERTENCIA: OPENWEATHER_API_KEY no encontrada. La funcionalidad del clima no estará disponible.")

# Configurar Unsplash
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

if not UNSPLASH_ACCESS_KEY:
    print("⚠️  ADVERTENCIA: UNSPLASH_ACCESS_KEY no encontrada. Las fotos no estarán disponibles.")

# Configurar CORS para permitir peticiones desde el frontend
# En producción, permite cualquier origen de Vercel o el especificado en la variable de entorno
ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS", "")

# Determinar si estamos en producción (Render siempre tiene PORT)
IS_PRODUCTION = os.getenv("PORT") is not None

if ALLOWED_ORIGINS_ENV:
    # Si hay una variable de entorno, usa esa lista
    ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",")]
    ALLOW_ORIGIN_REGEX = None
elif IS_PRODUCTION:
    # En producción (Render), permite todos los orígenes usando regex
    # Esto permite cualquier dominio (incluyendo Vercel)
    ALLOWED_ORIGINS = []
    ALLOW_ORIGIN_REGEX = r".*"  # Permite cualquier origen
else:
    # En desarrollo, solo localhost
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",  # Puerto por defecto de Vite
    ]
    ALLOW_ORIGIN_REGEX = None

# Configurar CORS
cors_config = {
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

if ALLOW_ORIGIN_REGEX:
    cors_config["allow_origin_regex"] = ALLOW_ORIGIN_REGEX
else:
    cors_config["allow_origins"] = ALLOWED_ORIGINS

app.add_middleware(
    CORSMiddleware,
    **cors_config
)

class InformacionViaje(BaseModel):
    destino: str = ""
    fecha: str = ""
    presupuesto: str = ""
    preferencia: str = ""

class MensajeHistorial(BaseModel):
    pregunta: str
    respuesta: str

class PreguntaRequest(BaseModel):
    pregunta: str
    informacion_viaje: InformacionViaje = InformacionViaje()
    historial: list[MensajeHistorial] = []  # Historial de conversaciones anteriores

class RespuestaResponse(BaseModel):
    respuesta: str
    fotos: list[str] = []  # URLs de las fotos de Unsplash

class InfoPanelResponse(BaseModel):
    temperatura: Optional[float] = None
    descripcion_clima: Optional[str] = None
    tipo_cambio_usd: Optional[float] = None
    tipo_cambio_eur: Optional[float] = None
    diferencia_horaria: Optional[str] = None
    hora_local: Optional[str] = None
    ciudad: Optional[str] = None

def obtener_info_clima_detallada(ciudad: str) -> dict:
    """
    Obtiene información detallada del clima de una ciudad.
    Retorna un diccionario con temperatura y descripción.
    """
    if not OPENWEATHER_API_KEY:
        return {}
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": ciudad,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",
            "lang": "es"
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "temperatura": round(data["main"]["temp"], 1),
                "descripcion": data["weather"][0]["description"].capitalize(),
                "ciudad": data["name"],
                "pais": data["sys"]["country"]
            }
        return {}
    except Exception as e:
        print(f"Error al obtener clima detallado: {e}")
        return {}

def obtener_info_clima_detallada(ciudad: str) -> dict:
    """
    Obtiene información detallada del clima de una ciudad.
    Retorna un diccionario con temperatura y descripción.
    """
    if not OPENWEATHER_API_KEY:
        return {}
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": ciudad,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",
            "lang": "es"
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "temperatura": round(data["main"]["temp"], 1),
                "descripcion": data["weather"][0]["description"].capitalize(),
                "ciudad": data["name"],
                "pais": data["sys"]["country"]
            }
        return {}
    except Exception as e:
        print(f"Error al obtener clima detallado: {e}")
        return {}

def obtener_clima_ciudad(ciudad: str) -> str:
    """
    Obtiene el clima actual de una ciudad usando OpenWeatherMap API.
    Retorna una cadena con la información del clima o un mensaje de error.
    """
    if not OPENWEATHER_API_KEY:
        return None
    
    try:
        # URL de la API de OpenWeatherMap
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": ciudad,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",  # Para obtener temperatura en Celsius
            "lang": "es"  # Para obtener descripciones en español
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extraer información relevante
            temperatura = data["main"]["temp"]
            sensacion_termica = data["main"]["feels_like"]
            descripcion = data["weather"][0]["description"].capitalize()
            humedad = data["main"]["humidity"]
            viento = data["wind"]["speed"] * 3.6  # Convertir m/s a km/h
            nombre_ciudad = data["name"]
            pais = data["sys"]["country"]
            
            # Formatear la información del clima
            info_clima = f"""🌤️ CLIMA ACTUAL EN {nombre_ciudad.upper()}, {pais}:
• Temperatura: {temperatura:.1f}°C
• Sensación térmica: {sensacion_termica:.1f}°C
• Condiciones: {descripcion}
• Humedad: {humedad}%
• Viento: {viento:.1f} km/h"""
            
            return info_clima
        else:
            return None
    
    except Exception as e:
        print(f"Error al obtener clima: {e}")
        return None

def obtener_tipo_cambio() -> dict:
    """
    Obtiene el tipo de cambio actual (USD y EUR) usando exchangerate-api.com
    Retorna un diccionario con las tasas de cambio.
    """
    try:
        # API gratuita sin necesidad de API key para uso básico
        url = "https://api.exchangerate-api.com/v4/latest/USD"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            # Obtener tasas para EUR y MXN (peso mexicano) como ejemplo
            eur_rate = data["rates"].get("EUR", 0)
            mxn_rate = data["rates"].get("MXN", 0)
            
            return {
                "usd_to_eur": round(1 / eur_rate, 4) if eur_rate else None,
                "usd_to_mxn": round(mxn_rate, 2) if mxn_rate else None,
                "eur_to_usd": round(eur_rate, 4) if eur_rate else None
            }
        return {}
    except Exception as e:
        print(f"Error al obtener tipo de cambio: {e}")
        return {}

def obtener_diferencia_horaria(ciudad: str) -> dict:
    """
    Obtiene la diferencia horaria y hora local de una ciudad usando worldtimeapi.org
    Retorna un diccionario con la información de zona horaria.
    """
    try:
        # Primero necesitamos obtener las coordenadas de la ciudad para la zona horaria
        if not OPENWEATHER_API_KEY:
            return {}
        
        # Obtener coordenadas de OpenWeatherMap
        url_weather = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": ciudad,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric"
        }
        
        response = requests.get(url_weather, params=params, timeout=5)
        if response.status_code != 200:
            return {}
        
        data = response.json()
        lat = data["coord"]["lat"]
        lon = data["coord"]["lon"]
        
        # Obtener zona horaria usando timeapi.io (gratis y sin API key)
        try:
            # Usar timeapi.io que es más simple y no requiere API key
            url_tz = f"https://timeapi.io/api/TimeZone/coordinate?latitude={lat}&longitude={lon}"
            tz_response = requests.get(url_tz, timeout=5)
            
            if tz_response.status_code == 200:
                tz_data = tz_response.json()
                timezone_id = tz_data.get("timeZone", "")
                
                # Obtener hora actual en esa zona horaria
                url_current = f"https://timeapi.io/api/Time/current/zone?timeZone={timezone_id}"
                current_response = requests.get(url_current, timeout=5)
                
                if current_response.status_code == 200:
                    current_data = current_response.json()
                    hora_local = current_data.get("time", "")
                    offset_seconds = current_data.get("offset", 0)
                    offset_horas = offset_seconds / 3600
                    
                    # Calcular diferencia con hora local del usuario (UTC)
                    hora_usuario_utc = datetime.utcnow()
                    
                    return {
                        "hora_local": hora_local.split("T")[1].split(".")[0] if "T" in hora_local else hora_local,
                        "offset_horas": offset_horas,
                        "diferencia": f"{offset_horas:+.0f}h" if offset_horas != 0 else "0h",
                        "timezone": timezone_id
                    }
        except Exception as e:
            print(f"Error al obtener zona horaria: {e}")
            # Fallback: usar worldtimeapi.org
            try:
                # Buscar zona horaria por nombre de ciudad (aproximado)
                url_wt = f"http://worldtimeapi.org/api/timezone"
                wt_response = requests.get(url_wt, timeout=5)
                if wt_response.status_code == 200:
                    # Esta es una aproximación simple
                    return {
                        "diferencia": "N/A",
                        "hora_local": ""
                    }
            except:
                pass
        
        return {}
    except Exception as e:
        print(f"Error al obtener diferencia horaria: {e}")
        return {}

def obtener_fotos_destino(ciudad: str, cantidad: int = 3) -> list[str]:
    """
    Obtiene fotos de una ciudad usando Unsplash API.
    Retorna una lista de URLs de fotos.
    """
    if not UNSPLASH_ACCESS_KEY:
        return []
    
    try:
        # URL de la API de Unsplash
        url = "https://api.unsplash.com/search/photos"
        headers = {
            "Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"
        }
        params = {
            "query": ciudad,
            "per_page": cantidad,
            "orientation": "landscape",  # Fotos horizontales se ven mejor
            "order_by": "popular"  # Las más populares primero
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            fotos = []
            
            for photo in data.get("results", [])[:cantidad]:
                # Usar la URL regular (no raw) para mejor calidad
                foto_url = photo["urls"]["regular"]
                fotos.append(foto_url)
            
            return fotos
        else:
            print(f"Error Unsplash API: {response.status_code}")
            return []
    
    except Exception as e:
        print(f"Error al obtener fotos de Unsplash: {e}")
        return []

def extraer_destino_de_pregunta(pregunta: str, info_viaje: InformacionViaje | None = None) -> str | None:
    """
    Intenta extraer el nombre de una ciudad/destino de la pregunta o información del viaje.
    """
    # Primero verificar si hay un destino en la información del viaje
    if info_viaje and info_viaje.destino:
        return info_viaje.destino.strip()
    
    # Buscar patrones comunes en la pregunta
    # Buscar frases como "en París", "a Tokio", "de Madrid", etc.
    patrones = [
        r'(?:en|a|de|para|hacia|desde)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)',
        r'([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)\s+(?:es|tiene|tiene|ofrece)',
    ]
    
    for patron in patrones:
        match = re.search(patron, pregunta, re.IGNORECASE)
        if match:
            posible_destino = match.group(1).strip()
            # Filtrar palabras comunes que no son ciudades
            palabras_comunes = ['viaje', 'viajar', 'viajero', 'destino', 'lugar', 'ciudad', 'país', 'país']
            if posible_destino.lower() not in palabras_comunes:
                return posible_destino
    
    return None

def generar_respuesta_viaje(pregunta: str, info_viaje: InformacionViaje | None = None, historial: list[MensajeHistorial] = None) -> tuple[str, list[str]]:
    """
    Genera una respuesta usando Gemini AI.
    """
    if not GEMINI_API_KEY:
        return ("❌ Error: La API key de Gemini no está configurada. Por favor, crea un archivo .env en la carpeta backend con tu GEMINI_API_KEY.", [])
    
    # Lista de modelos a intentar (en orden de preferencia)
    # Primero intentamos con los modelos más recientes disponibles
    modelos_a_intentar = [
        'gemini-2.5-flash',                    # Modelo más reciente y rápido
        'gemini-2.5-flash-preview-05-20',      # Preview más reciente
        'gemini-2.5-pro-preview-03-25',       # Modelo pro más reciente
        'gemini-2.5-flash-lite-preview-06-17', # Versión lite
        'gemini-1.5-flash',                    # Versión anterior estable
        'gemini-1.5-pro',                      # Versión anterior pro
        'gemini-pro',                          # Versión legacy
    ]
    
    for nombre_modelo in modelos_a_intentar:
        try:
            # Crear el modelo de Gemini
            model = genai.GenerativeModel(nombre_modelo)
            
            # Intentar obtener el clima y fotos del destino
            info_clima = None
            fotos_destino = []
            destino = extraer_destino_de_pregunta(pregunta, info_viaje)
            if destino:
                info_clima = obtener_clima_ciudad(destino)
                fotos_destino = obtener_fotos_destino(destino, cantidad=3)
            
            # Construir contexto de información del viaje
            contexto_viaje = ""
            if info_viaje and (info_viaje.destino or info_viaje.fecha or info_viaje.presupuesto or info_viaje.preferencia):
                contexto_viaje = "\n\n📋 INFORMACIÓN DEL VIAJE DEL USUARIO:\n"
                if info_viaje.destino:
                    contexto_viaje += f"- Destino: {info_viaje.destino}\n"
                if info_viaje.fecha:
                    contexto_viaje += f"- Fecha: {info_viaje.fecha}\n"
                if info_viaje.presupuesto:
                    presupuesto_texto = {
                        'economico': 'Económico (menos de $500)',
                        'medio': 'Medio ($500 - $1,500)',
                        'alto': 'Alto ($1,500 - $3,000)',
                        'premium': 'Premium (más de $3,000)'
                    }.get(info_viaje.presupuesto, info_viaje.presupuesto)
                    contexto_viaje += f"- Presupuesto: {presupuesto_texto}\n"
                if info_viaje.preferencia:
                    preferencia_texto = {
                        'aventura': 'Aventura 🏔️',
                        'relajacion': 'Relajación 🏖️',
                        'cultura': 'Cultura 🏛️'
                    }.get(info_viaje.preferencia, info_viaje.preferencia)
                    contexto_viaje += f"- Preferencia: {preferencia_texto}\n"
                contexto_viaje += "\nUsa esta información para personalizar tus respuestas y recomendaciones."
            
            # Agregar información del clima al contexto si está disponible
            if info_clima:
                contexto_viaje += f"\n\n{info_clima}\n\nIncluye esta información del clima actual al inicio de tu respuesta, justo después del saludo y antes de la sección ALOJAMIENTO."
            
            # Agregar historial de conversación al contexto
            contexto_historial = ""
            if historial and len(historial) > 0:
                contexto_historial = "\n\n💬 HISTORIAL DE CONVERSACIÓN ANTERIOR:\n"
                for i, msg in enumerate(historial[-5:], 1):  # Solo últimas 5 conversaciones
                    contexto_historial += f"\nConversación {i}:\n"
                    contexto_historial += f"Usuario: {msg.pregunta}\n"
                    contexto_historial += f"Alex: {msg.respuesta[:200]}...\n"  # Resumen de la respuesta
                contexto_historial += "\nIMPORTANTE: Si el usuario pregunta sobre 'allí', 'ese lugar', 'ese destino', o hace referencias similares, se refiere al último destino mencionado en el historial. Usa el contexto del historial para dar respuestas coherentes y continuar la conversación de manera natural."
            
            # Crear el prompt con la personalidad de Alex
            prompt = f"""Eres Alex, el consultor personal de viajes de ViajeIA. Tu personalidad es:

🎯 IDENTIDAD:
- Te presentas siempre como "Alex, tu consultor personal de viajes"
- Eres entusiasta, amigable y apasionado por los viajes
- Usas un tono conversacional y cercano

📋 FORMATO DE RESPUESTAS - ESTRUCTURA OBLIGATORIA:
SIEMPRE debes responder con esta estructura exacta, usando estas secciones en este orden:

ALOJAMIENTO: [recomendaciones específicas de hoteles, hostales, o alojamientos con bullets y emojis]
COMIDA LOCAL: [recomendaciones de restaurantes, platos típicos, lugares para comer con bullets y emojis]
LUGARES IMPERDIBLES: [atracciones, sitios turísticos, actividades que no se pueden perder con bullets y emojis]
CONSEJOS LOCALES: [tips especiales, información útil, advertencias, recomendaciones prácticas con bullets y emojis]
ESTIMACIÓN DE COSTOS: [breakdown aproximado de gastos por categoría (alojamiento, comida, transporte, actividades) con bullets y emojis]

IMPORTANTE:
- SIEMPRE incluye las 5 secciones en el orden indicado
- Usa bullets (• o -) dentro de cada sección
- INCLUYE emojis de viajes relevantes (✈️ 🏨 🗺️ 🌍 🎒 🏖️ 🏔️ 🚗 🚢 🎫 📸 💰 🍽️ 🏛️ 🌮 etc.)
- Personaliza cada sección basándote en la información del viaje que conoces (destino, fecha, presupuesto, preferencias)
- Sé específico y útil en cada recomendación
- Si no tienes información suficiente, haz suposiciones razonables basadas en el destino

💬 ESTILO:
- Puedes empezar con un saludo entusiasta breve antes de la estructura
- Puedes terminar con una pregunta amigable después de la estructura
- Mantén un tono conversacional y cercano

Pregunta del usuario: {pregunta}{contexto_viaje}{contexto_historial}

Responde como Alex, SIEMPRE usando la estructura obligatoria con las 5 secciones (ALOJAMIENTO, COMIDA LOCAL, LUGARES IMPERDIBLES, CONSEJOS LOCALES, ESTIMACIÓN DE COSTOS), siendo entusiasta, organizado con bullets, incluyendo emojis de viajes, y personalizando según la información del viaje disponible. Si hay historial de conversación, úsalo para dar continuidad y contexto a tu respuesta:"""
            
            # Generar la respuesta
            response = model.generate_content(prompt)
            
            return response.text, fotos_destino
            
        except Exception as e:
            # Si este modelo falla, intentar el siguiente
            error_msg = str(e)
            if "404" in error_msg or "not found" in error_msg.lower():
                # Este modelo no está disponible, intentar el siguiente
                continue
            else:
                # Otro tipo de error, devolver el mensaje
                return (f"❌ Error al comunicarse con Gemini: {error_msg}\n\nPor favor, verifica tu API key e intenta de nuevo.", [])
    
    # Si todos los modelos fallaron
    try:
        # Intentar listar modelos disponibles para ayudar al usuario
        modelos_disponibles = [m.name for m in genai.list_models()]
        modelos_texto = "\n".join([f"  - {m}" for m in modelos_disponibles[:5]])
        return (f"""❌ No se pudo encontrar un modelo compatible de Gemini.

Modelos disponibles detectados:
{modelos_texto}

Por favor, verifica:
1. Que tu API key sea válida
2. Que tengas acceso a los modelos de Gemini
3. Intenta usar uno de los modelos listados arriba""", [])
    except:
        return ("❌ Error: No se pudo conectar con Gemini. Por favor, verifica tu API key y que tengas acceso a los modelos de Gemini.", [])

@app.get("/")
def read_root():
    return {"message": "ViajeIA API está funcionando correctamente"}

@app.post("/api/planificar", response_model=RespuestaResponse)
def planificar_viaje(request: PreguntaRequest):
    """
    Endpoint para recibir preguntas sobre viajes y generar respuestas.
    """
    respuesta, fotos = generar_respuesta_viaje(request.pregunta, request.informacion_viaje, request.historial)
    return RespuestaResponse(respuesta=respuesta, fotos=fotos)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/info-panel", response_model=InfoPanelResponse)
def obtener_info_panel(ciudad: Optional[str] = None):
    """
    Endpoint para obtener información del panel lateral:
    - Temperatura actual
    - Tipo de cambio (USD/EUR)
    - Diferencia horaria
    """
    resultado = {}
    
    # Obtener tipo de cambio (no depende de la ciudad)
    tipo_cambio = obtener_tipo_cambio()
    resultado["tipo_cambio_usd"] = tipo_cambio.get("usd_to_eur")
    resultado["tipo_cambio_eur"] = tipo_cambio.get("eur_to_usd")
    
    # Si hay una ciudad, obtener clima y diferencia horaria
    if ciudad:
        clima_info = obtener_info_clima_detallada(ciudad)
        if clima_info:
            resultado["temperatura"] = clima_info.get("temperatura")
            resultado["descripcion_clima"] = clima_info.get("descripcion")
            resultado["ciudad"] = clima_info.get("ciudad")
        
        tz_info = obtener_diferencia_horaria(ciudad)
        if tz_info:
            resultado["diferencia_horaria"] = tz_info.get("diferencia")
            resultado["hora_local"] = tz_info.get("hora_local")
    
    return InfoPanelResponse(**resultado)

