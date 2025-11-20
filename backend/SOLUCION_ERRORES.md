# Solución de Errores Comunes

## Error: Failed building wheel for pydantic-core

Este error ocurre cuando Python intenta compilar `pydantic-core` desde el código fuente porque no encuentra una versión precompilada (wheel) para tu versión de Python.

### Solución 1: Usar Python 3.11 o 3.12 (Recomendado)

Las versiones 3.11 y 3.12 de Python tienen mejor soporte y wheels precompilados disponibles.

**En macOS:**
```bash
# Instalar Python 3.12 con Homebrew (si lo tienes)
brew install python@3.12

# Crear entorno virtual con Python 3.12
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

**En Windows:**
1. Descarga Python 3.12 desde https://www.python.org/downloads/
2. Durante la instalación, marca "Add Python to PATH"
3. Crea el entorno virtual:
```bash
py -3.12 -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Solución 2: Actualizar pip y herramientas

A veces el problema se resuelve actualizando las herramientas de instalación:

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Solución 3: Instalar Rust (Avanzado)

Si necesitas usar Python 3.14 o una versión muy nueva, puedes instalar Rust:

**En macOS:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Luego intenta instalar las dependencias de nuevo.

**Nota:** Esta solución es más compleja y generalmente no es necesaria si usas Python 3.11 o 3.12.

## Verificar tu versión de Python

Para ver qué versión de Python estás usando:
```bash
python --version
# o
python3 --version
```

Para ver todas las versiones instaladas:
```bash
# macOS/Linux
ls /usr/bin/python*  # o donde estén instaladas

# Windows
py --list
```









