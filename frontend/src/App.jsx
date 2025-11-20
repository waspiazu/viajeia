import { useState, useEffect } from 'react'
import axios from 'axios'
import InfoPanel from './InfoPanel'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import './App.css'

// Configurar la URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Debug: mostrar la URL que se está usando (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', API_BASE_URL)
  console.log('🔧 VITE_API_URL env:', import.meta.env.VITE_API_URL)
}

// Configurar axios con la URL base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
})

function App() {
  const [showSurvey, setShowSurvey] = useState(true)
  const [surveyData, setSurveyData] = useState({
    destino: '',
    fecha: '',
    presupuesto: '',
    preferencia: ''
  })
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFirstMessage, setIsFirstMessage] = useState(true)
  const [historial, setHistorial] = useState([]) // Historial de conversaciones
  const [ultimoDestino, setUltimoDestino] = useState(null) // Último destino mencionado
  const [favoritos, setFavoritos] = useState([]) // Destinos guardados como favoritos
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false) // Toggle para mostrar favoritos
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null) // Destino seleccionado para ver detalles

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    const favoritosGuardados = localStorage.getItem('viajeia_favoritos')
    if (favoritosGuardados) {
      try {
        setFavoritos(JSON.parse(favoritosGuardados))
      } catch (e) {
        console.error('Error al cargar favoritos:', e)
      }
    }
  }, [])

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    if (favoritos.length > 0) {
      localStorage.setItem('viajeia_favoritos', JSON.stringify(favoritos))
    }
  }, [favoritos])

  // Función auxiliar para extraer ciudad de la respuesta
  const extraerCiudadDeRespuesta = (respuesta) => {
    // Buscar patrones comunes de ciudades en la respuesta
    const match = respuesta.match(/(?:en|de|a)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)/i)
    return match ? match[1] : null
  }

  // Función para guardar destino como favorito
  const guardarComoFavorito = () => {
    const destino = ultimoDestino || surveyData.destino
    if (!destino) {
      alert('No hay un destino para guardar. Realiza una consulta primero.')
      return
    }

    // Verificar si ya existe
    const yaExiste = favoritos.some(fav => fav.destino.toLowerCase() === destino.toLowerCase())
    if (yaExiste) {
      alert('Este destino ya está en tus favoritos.')
      return
    }

    // Crear objeto de favorito
    const nuevoFavorito = {
      id: Date.now(),
      destino: destino,
      fecha: surveyData.fecha || new Date().toISOString().split('T')[0],
      presupuesto: surveyData.presupuesto || '',
      preferencia: surveyData.preferencia || '',
      fechaGuardado: new Date().toISOString(),
      historial: historial.length > 0 ? historial : (response ? [{
        pregunta: question || 'Consulta inicial',
        respuesta: response,
        fotos: fotos,
        timestamp: new Date().toLocaleTimeString('es-ES')
      }] : []),
      fotos: fotos.length > 0 ? fotos : (historial.length > 0 ? historial[historial.length - 1]?.fotos || [] : [])
    }

    setFavoritos([...favoritos, nuevoFavorito])
    alert(`✅ ${destino} guardado en tus favoritos!`)
  }

  // Función para eliminar favorito
  const eliminarFavorito = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este destino de tus favoritos?')) {
      setFavoritos(favoritos.filter(fav => fav.id !== id))
    }
  }

  // Función para ver detalles de un destino guardado
  const verDetallesDestino = (favorito) => {
    setDestinoSeleccionado(favorito)
    setMostrarFavoritos(false)
    // Restaurar datos del favorito
    setSurveyData({
      destino: favorito.destino,
      fecha: favorito.fecha,
      presupuesto: favorito.presupuesto,
      preferencia: favorito.preferencia
    })
    setHistorial(favorito.historial || [])
    setUltimoDestino(favorito.destino)
    setShowSurvey(false)
  }

  const handleSurveySubmit = (e) => {
    e.preventDefault()
    if (surveyData.destino && surveyData.fecha && surveyData.presupuesto && surveyData.preferencia) {
      setShowSurvey(false)
    }
  }

  const handleSurveyChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Función para procesar referencias como "allí", "ese lugar", etc.
  const procesarReferencias = (pregunta, ultimoDestino) => {
    if (!ultimoDestino) return pregunta
    
    // Patrones que indican referencia al último destino
    const patronesReferencia = [
      /\b(allí|ahí|ese lugar|ese destino|ese sitio|ese país|esa ciudad)\b/gi,
      /\b(el transporte allí|el clima allí|la comida allí|los hoteles allí)\b/gi,
      /\b(¿qué tal|qué tal|como es|como están)\s+(allí|ahí)\b/gi
    ]
    
    let preguntaProcesada = pregunta
    for (const patron of patronesReferencia) {
      if (patron.test(pregunta)) {
        preguntaProcesada = pregunta.replace(patron, (match) => {
          return match.replace(/(allí|ahí|ese lugar|ese destino|ese sitio|ese país|esa ciudad)/gi, `en ${ultimoDestino}`)
        })
        break
      }
    }
    
    return preguntaProcesada
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setResponse('')
    setFotos([])

    // Detectar si la pregunta hace referencia al último destino
    const preguntaProcesada = procesarReferencias(question, ultimoDestino)

    try {
      const res = await apiClient.post('/api/planificar', {
        pregunta: preguntaProcesada,
        informacion_viaje: surveyData,
        historial: historial.slice(-5) // Enviar solo las últimas 5 conversaciones
      })
      setResponse(res.data.respuesta)
      setFotos(res.data.fotos || [])
      setIsFirstMessage(false)
      
      // Actualizar historial
      const nuevoHistorial = [
        ...historial,
        {
          pregunta: question,
          respuesta: res.data.respuesta,
          fotos: res.data.fotos || [],
          timestamp: new Date().toLocaleTimeString('es-ES')
        }
      ]
      setHistorial(nuevoHistorial)
      
      // Actualizar último destino si se menciona uno nuevo
      const destinoEnPregunta = extraerCiudadDeRespuesta(question) || surveyData.destino
      if (destinoEnPregunta) {
        setUltimoDestino(destinoEnPregunta)
      }
    } catch (error) {
      console.error('Error:', error)
      let mensajeError = 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.'
      
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        mensajeError = `Error del servidor: ${error.response.data?.detail || error.response.statusText || 'Error desconocido'}`
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        mensajeError = 'No se pudo conectar con el servidor. Por favor, verifica que el backend esté corriendo en http://localhost:8000'
      } else {
        // Algo pasó al configurar la petición
        mensajeError = `Error: ${error.message}`
      }
      
      setResponse(mensajeError)
      setIsFirstMessage(false)
    } finally {
      setLoading(false)
      setQuestion('') // Limpiar el campo de pregunta después de enviar
    }
  }

  // Función para convertir imagen URL a base64
  const imagenUrlABase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        try {
          const dataURL = canvas.toDataURL('image/jpeg', 0.8)
          resolve(dataURL)
        } catch (e) {
          reject(e)
        }
      }
      img.onerror = reject
      img.src = url
    })
  }

  // Función para generar y descargar el PDF del itinerario
  const generarPDFItinerario = async () => {
    if (historial.length === 0 && !response) {
      alert('No hay información para generar el itinerario. Realiza al menos una consulta primero.')
      return
    }

    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPos = 20
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)

      // Colores del tema
      const colorAzul = [30, 64, 175] // #1e40af
      const colorAzulClaro = [59, 130, 246] // #3b82f6
      const colorGris = [107, 114, 128] // #6b7280

      // Logo/Header de ViajeIA
      doc.setFillColor(...colorAzul)
      doc.rect(0, 0, pageWidth, 40, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('✈️ ViajeIA', margin, 25)
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Tu Asistente Personal de Viajes', margin, 32)

      yPos = 50

      // Información del viaje
      doc.setTextColor(...colorAzul)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('📋 Información del Viaje', margin, yPos)
      yPos += 10

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      const infoViaje = [
        ['Destino:', surveyData.destino || ultimoDestino || 'No especificado'],
        ['Fecha:', surveyData.fecha || 'No especificada'],
        ['Presupuesto:', surveyData.presupuesto || 'No especificado'],
        ['Preferencia:', surveyData.preferencia ? 
          (surveyData.preferencia === 'aventura' ? 'Aventura 🏔️' :
           surveyData.preferencia === 'relajacion' ? 'Relajación 🏖️' :
           'Cultura 🏛️') : 'No especificada']
      ]

      infoViaje.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, margin, yPos)
        doc.setFont('helvetica', 'normal')
        doc.text(value, margin + 40, yPos)
        yPos += 7
      })

      yPos += 10

      // Procesar todas las conversaciones del historial
      const todasLasFotos = new Set()
      const todasLasRecomendaciones = []

      // Agregar respuesta actual si existe
      if (response) {
        todasLasRecomendaciones.push({
          pregunta: question || 'Consulta inicial',
          respuesta: response,
          fotos: fotos
        })
        fotos.forEach(f => todasLasFotos.add(f))
      }

      // Agregar historial
      historial.forEach(item => {
        todasLasRecomendaciones.push(item)
        item.fotos.forEach(f => todasLasFotos.add(f))
      })

      // Sección de Recomendaciones
      todasLasRecomendaciones.forEach((item, index) => {
        // Verificar si necesitamos una nueva página
        if (yPos > pageHeight - 60) {
          doc.addPage()
          yPos = 20
        }

        doc.setTextColor(...colorAzul)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(`💬 Consulta ${index + 1}: ${item.pregunta}`, margin, yPos)
        yPos += 8

        // Procesar la respuesta y extraer secciones
        const lineas = item.respuesta.split('\n')
        let seccionActual = ''
        
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')

        lineas.forEach(linea => {
          const trimmed = linea.trim()
          if (!trimmed) return

          // Detectar encabezados de sección
          const matchSeccion = trimmed.match(/^(ALOJAMIENTO|COMIDA LOCAL|LUGARES IMPERDIBLES|CONSEJOS LOCALES|ESTIMACIÓN DE COSTOS):/i)
          
          if (matchSeccion) {
            // Nueva sección
            if (yPos > pageHeight - 40) {
              doc.addPage()
              yPos = 20
            }
            
            seccionActual = matchSeccion[1]
            yPos += 5
            doc.setTextColor(...colorAzulClaro)
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text(`📌 ${seccionActual}:`, margin, yPos)
            yPos += 7
            doc.setTextColor(0, 0, 0)
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
          } else {
            // Contenido de la sección
            if (yPos > pageHeight - 20) {
              doc.addPage()
              yPos = 20
            }

            // Limpiar emojis y formatear
            const textoLimpio = trimmed.replace(/^[•\-\*]\s*/, '• ')
            const lineasTexto = doc.splitTextToSize(textoLimpio, contentWidth)
            
            lineasTexto.forEach(texto => {
              doc.text(texto, margin + 5, yPos)
              yPos += 5
            })
          }
        })

        yPos += 10
      })

      // Agregar fotos al final
      if (todasLasFotos.size > 0) {
        if (yPos > pageHeight - 80) {
          doc.addPage()
          yPos = 20
        }

        doc.setTextColor(...colorAzul)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('📸 Fotos del Destino', margin, yPos)
        yPos += 15

        const fotosArray = Array.from(todasLasFotos).slice(0, 6) // Máximo 6 fotos
        const fotosPorFila = 2
        const anchoFoto = (contentWidth - 10) / fotosPorFila
        const altoFoto = 40

        for (let i = 0; i < fotosArray.length; i++) {
          if (yPos + altoFoto > pageHeight - 20) {
            doc.addPage()
            yPos = 20
          }

          const columna = i % fotosPorFila
          const xPos = margin + (columna * (anchoFoto + 10))

          try {
            const imagenBase64 = await imagenUrlABase64(fotosArray[i])
            doc.addImage(imagenBase64, 'JPEG', xPos, yPos, anchoFoto, altoFoto)
          } catch (error) {
            console.error('Error al cargar imagen:', error)
            // Si falla, solo dibujar un rectángulo
            doc.setDrawColor(...colorGris)
            doc.rect(xPos, yPos, anchoFoto, altoFoto)
            doc.text('Imagen no disponible', xPos + 5, yPos + altoFoto / 2)
          }

          if ((i + 1) % fotosPorFila === 0) {
            yPos += altoFoto + 10
          }
        }
      }

      // Footer
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setTextColor(...colorGris)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Página ${i} de ${totalPages} - Generado por ViajeIA`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
      }

      // Descargar el PDF
      const nombreArchivo = `Itinerario_${(surveyData.destino || 'Viaje').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(nombreArchivo)
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.')
    }
  }

  // Obtener ciudad del destino para el panel
  const ciudadDestino = ultimoDestino || surveyData.destino || (response ? extraerCiudadDeRespuesta(response) : null)

  return (
    <div className="app">
      <div className="app-layout">
        <div className="main-content">
          <div className="container">
        <div className="header-section">
          <h1 className="title">ViajeIA - Tu Asistente Personal de Viajes</h1>
          <div className="header-buttons">
            <button 
              className="favoritos-toggle-button"
              onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            >
              {mostrarFavoritos ? '← Volver' : `⭐ Mis Viajes Guardados ${favoritos.length > 0 ? `(${favoritos.length})` : ''}`}
            </button>
          </div>
        </div>
        
        {mostrarFavoritos ? (
          <div className="favoritos-container">
            <h2 className="favoritos-title">⭐ Mis Viajes Guardados</h2>
            {favoritos.length === 0 ? (
              <div className="favoritos-empty">
                <p>📭 Aún no has guardado ningún destino</p>
                <p className="favoritos-hint">Guarda tus destinos favoritos haciendo clic en "⭐ Guardar como favorito" después de una consulta</p>
              </div>
            ) : (
              <div className="favoritos-grid">
                {favoritos.map((favorito) => (
                  <div key={favorito.id} className="favorito-card">
                    {favorito.fotos && favorito.fotos.length > 0 && (
                      <div className="favorito-imagen">
                        <img src={favorito.fotos[0]} alt={favorito.destino} />
                      </div>
                    )}
                    <div className="favorito-content">
                      <h3 className="favorito-destino">{favorito.destino}</h3>
                      <div className="favorito-info">
                        {favorito.fecha && (
                          <div className="favorito-info-item">
                            <span className="favorito-label">📅 Fecha:</span>
                            <span>{new Date(favorito.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        )}
                        {favorito.presupuesto && (
                          <div className="favorito-info-item">
                            <span className="favorito-label">💰 Presupuesto:</span>
                            <span>{favorito.presupuesto}</span>
                          </div>
                        )}
                        {favorito.preferencia && (
                          <div className="favorito-info-item">
                            <span className="favorito-label">🎯 Preferencia:</span>
                            <span>
                              {favorito.preferencia === 'aventura' ? '🏔️ Aventura' :
                               favorito.preferencia === 'relajacion' ? '🏖️ Relajación' :
                               '🏛️ Cultura'}
                            </span>
                          </div>
                        )}
                        <div className="favorito-info-item">
                          <span className="favorito-label">💬 Consultas:</span>
                          <span>{favorito.historial?.length || 0}</span>
                        </div>
                      </div>
                      <div className="favorito-actions">
                        <button 
                          className="favorito-ver-button"
                          onClick={() => verDetallesDestino(favorito)}
                        >
                          👁️ Ver detalles
                        </button>
                        <button 
                          className="favorito-eliminar-button"
                          onClick={() => eliminarFavorito(favorito.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : showSurvey ? (
          <div className="survey-container">
            <div className="survey-header">
              <h2>🗺️ Cuéntame sobre tu viaje</h2>
              <p>Ayúdame a conocerte mejor para crear el plan perfecto</p>
            </div>
            
            <form onSubmit={handleSurveySubmit} className="survey-form">
              <div className="survey-field">
                <label htmlFor="destino">¿A dónde quieres viajar? ✈️</label>
                <input
                  type="text"
                  id="destino"
                  className="survey-input"
                  placeholder="Ej: París, Tokio, Cancún..."
                  value={surveyData.destino}
                  onChange={(e) => handleSurveyChange('destino', e.target.value)}
                  required
                />
              </div>

              <div className="survey-field">
                <label htmlFor="fecha">¿Cuándo? 📅</label>
                <input
                  type="date"
                  id="fecha"
                  className="survey-input"
                  value={surveyData.fecha}
                  onChange={(e) => handleSurveyChange('fecha', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="survey-field">
                <label htmlFor="presupuesto">¿Cuál es tu presupuesto aproximado? 💰</label>
                <select
                  id="presupuesto"
                  className="survey-select"
                  value={surveyData.presupuesto}
                  onChange={(e) => handleSurveyChange('presupuesto', e.target.value)}
                  required
                >
                  <option value="">Selecciona un rango</option>
                  <option value="economico">Económico (menos de $500)</option>
                  <option value="medio">Medio ($500 - $1,500)</option>
                  <option value="alto">Alto ($1,500 - $3,000)</option>
                  <option value="premium">Premium (más de $3,000)</option>
                </select>
              </div>

              <div className="survey-field">
                <label>¿Qué tipo de experiencia prefieres? 🎯</label>
                <div className="preference-buttons">
                  <button
                    type="button"
                    className={`preference-btn ${surveyData.preferencia === 'aventura' ? 'active' : ''}`}
                    onClick={() => handleSurveyChange('preferencia', 'aventura')}
                  >
                    🏔️ Aventura
                  </button>
                  <button
                    type="button"
                    className={`preference-btn ${surveyData.preferencia === 'relajacion' ? 'active' : ''}`}
                    onClick={() => handleSurveyChange('preferencia', 'relajacion')}
                  >
                    🏖️ Relajación
                  </button>
                  <button
                    type="button"
                    className={`preference-btn ${surveyData.preferencia === 'cultura' ? 'active' : ''}`}
                    onClick={() => handleSurveyChange('preferencia', 'cultura')}
                  >
                    🏛️ Cultura
                  </button>
                </div>
                {!surveyData.preferencia && (
                  <p className="survey-hint">Selecciona una opción</p>
                )}
              </div>

              <button type="submit" className="survey-submit-button">
                ¡Empezar a planificar! 🚀
              </button>
            </form>
          </div>
        ) : (
          <>
            {isFirstMessage && !response && (
              <div className="welcome-message">
                <p>👋 ¡Hola! Soy <strong>Alex, tu consultor personal de viajes</strong>.</p>
                <p>Perfecto, ya conozco tus preferencias. ¡Ahora puedo ayudarte mejor! 🌍</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="form">
              <div className="input-group">
                <textarea
                  className="input-field"
                  placeholder="Cuéntame sobre tu viaje... ¿A dónde quieres ir? ¿Qué tipo de experiencia buscas? ✈️"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows="4"
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading || !question.trim()}
              >
                {loading ? 'Planificando...' : 'Planificar mi viaje'}
              </button>
            </form>

            {(historial.length > 0 || response) && (
              <div className="action-buttons-section">
                <button 
                  className="download-pdf-button"
                  onClick={generarPDFItinerario}
                  title="Descargar itinerario completo en PDF"
                >
                  📄 Descargar mi itinerario en PDF
                </button>
                <button 
                  className="save-favorite-button"
                  onClick={guardarComoFavorito}
                  title="Guardar este destino en mis favoritos"
                >
                  ⭐ Guardar como favorito
                </button>
              </div>
            )}

            {historial.length > 0 && (
              <div className="historial-container">
                <div className="historial-header">
                  <h3 className="historial-title">💬 Historial de Conversación</h3>
                  <button 
                    className="historial-clear-btn"
                    onClick={() => setHistorial([])}
                    title="Limpiar historial"
                  >
                    🗑️
                  </button>
                </div>
                <div className="historial-items">
                  {historial.map((item, index) => (
                    <div key={index} className="historial-item">
                      <div className="historial-pregunta">
                        <span className="historial-label">Tú:</span>
                        <span className="historial-text">{item.pregunta}</span>
                        <span className="historial-time">{item.timestamp}</span>
                      </div>
                      <div className="historial-respuesta">
                        <span className="historial-label">Alex:</span>
                        <div className="historial-respuesta-content">
                          {item.fotos.length > 0 && (
                            <div className="historial-fotos">
                              {item.fotos.slice(0, 2).map((foto, idx) => (
                                <img key={idx} src={foto} alt="" className="historial-foto" />
                              ))}
                            </div>
                          )}
                          <div className="historial-respuesta-text">
                            {item.respuesta.split('\n').slice(0, 3).join(' ')}...
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {response && (
              <div className="response-area">
                <h2 className="response-title">💬 Alex dice:</h2>
                
                {fotos.length > 0 && (
                  <div className="fotos-container">
                    {fotos.map((foto, index) => (
                      <img 
                        key={index}
                        src={foto} 
                        alt={`Vista del destino ${index + 1}`}
                        className="destino-foto"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
                
                <div className="response-content">
                  {response.split('\n').map((line, index) => {
                    const trimmedLine = line.trim()
                    const isSectionHeader = /^(ALOJAMIENTO|COMIDA LOCAL|LUGARES IMPERDIBLES|CONSEJOS LOCALES|ESTIMACIÓN DE COSTOS):/i.test(trimmedLine)
                    
                    if (isSectionHeader) {
                      return (
                        <div 
                          key={index} 
                          className="response-section-header"
                          style={{ 
                            marginTop: index > 0 ? '24px' : '0',
                            marginBottom: '12px'
                          }}
                        >
                          {trimmedLine}
                        </div>
                      )
                    }
                    
                    return (
                      <div 
                        key={index} 
                        style={{ marginBottom: trimmedLine ? '8px' : '4px' }}
                      >
                        {trimmedLine || '\u00A0'}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
          </div>
        </div>
        
        <aside className="sidebar">
          <InfoPanel ciudad={ciudadDestino} />
        </aside>
      </div>
    </div>
  )
}

export default App

