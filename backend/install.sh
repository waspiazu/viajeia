#!/bin/bash

# Script de instalación para ViajeIA Backend
# Este script ayuda a instalar las dependencias correctamente

echo "🚀 Instalando dependencias de ViajeIA Backend..."
echo ""

# Verificar versión de Python
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "📌 Versión de Python detectada: $PYTHON_VERSION"

# Extraer versión mayor y menor
MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

# Verificar si es Python 3.11 o 3.12 (recomendado)
if [ "$MAJOR" -eq 3 ] && ([ "$MINOR" -eq 11 ] || [ "$MINOR" -eq 12 ]); then
    echo "✅ Versión de Python compatible detectada"
elif [ "$MAJOR" -eq 3 ] && [ "$MINOR" -ge 13 ]; then
    echo "⚠️  Advertencia: Estás usando Python 3.$MINOR"
    echo "   Se recomienda usar Python 3.11 o 3.12 para mejor compatibilidad"
    echo "   Si encuentras errores, considera cambiar a Python 3.11 o 3.12"
    echo ""
fi

# Actualizar pip
echo "📦 Actualizando pip..."
python3 -m pip install --upgrade pip setuptools wheel

# Instalar dependencias
echo ""
echo "📥 Instalando dependencias..."
python3 -m pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Instalación completada exitosamente!"
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. Crea un archivo .env con tu GEMINI_API_KEY"
    echo "   2. Ejecuta: uvicorn main:app --reload --port 8000"
else
    echo ""
    echo "❌ Error durante la instalación"
    echo ""
    echo "💡 Soluciones:"
    echo "   1. Verifica que estés usando Python 3.11 o 3.12"
    echo "   2. Lee el archivo SOLUCION_ERRORES.md para más ayuda"
    echo "   3. Intenta: pip install --upgrade pip setuptools wheel"
    exit 1
fi









