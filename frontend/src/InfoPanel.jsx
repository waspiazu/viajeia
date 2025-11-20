import { useState, useEffect } from 'react'
import axios from 'axios'
import './InfoPanel.css'

// Configurar la URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Configurar axios con la URL base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos de timeout
})

function InfoPanel({ ciudad }) {
  const [info, setInfo] = useState({
    temperatura: null,
    descripcion_clima: null,
    tipo_cambio_usd: null,
    tipo_cambio_eur: null,
    diferencia_horaria: null,
    hora_local: null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get('/api/info-panel', {
          params: { ciudad: ciudad || '' }
        })
        setInfo(res.data)
      } catch (error) {
        console.error('Error al obtener información del panel:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInfo()
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchInfo, 300000)
    return () => clearInterval(interval)
  }, [ciudad])

  return (
    <div className="info-panel">
      <h3 className="panel-title">📊 Información Actual</h3>
      
      {loading ? (
        <div className="panel-loading">Cargando...</div>
      ) : (
        <>
          {info.temperatura !== null && (
            <div className="panel-item">
              <div className="panel-icon">🌡️</div>
              <div className="panel-content">
                <div className="panel-label">Temperatura</div>
                <div className="panel-value">
                  {info.temperatura}°C
                  {info.descripcion_clima && (
                    <span className="panel-subtext"> - {info.descripcion_clima}</span>
                  )}
                </div>
                {info.ciudad && (
                  <div className="panel-location">{info.ciudad}</div>
                )}
              </div>
            </div>
          )}

          <div className="panel-item">
            <div className="panel-icon">💱</div>
            <div className="panel-content">
              <div className="panel-label">Tipo de Cambio</div>
              {info.tipo_cambio_usd && (
                <div className="panel-value">1 USD = {info.tipo_cambio_usd} EUR</div>
              )}
              {info.tipo_cambio_eur && (
                <div className="panel-value">1 EUR = {info.tipo_cambio_eur} USD</div>
              )}
            </div>
          </div>

          {info.diferencia_horaria && (
            <div className="panel-item">
              <div className="panel-icon">🕐</div>
              <div className="panel-content">
                <div className="panel-label">Diferencia Horaria</div>
                <div className="panel-value">{info.diferencia_horaria}</div>
                {info.hora_local && (
                  <div className="panel-subtext">Hora local: {info.hora_local}</div>
                )}
              </div>
            </div>
          )}

          {!ciudad && (
            <div className="panel-hint">
              💡 Completa el formulario o pregunta sobre un destino para ver más información
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InfoPanel

