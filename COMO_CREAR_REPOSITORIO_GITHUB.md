# 📦 Cómo Crear un Repositorio en GitHub (Guía Paso a Paso)

## Paso 1: Crear una Cuenta en GitHub (si no tienes una)

1. Ve a https://github.com
2. Click en "Sign up" (Registrarse)
3. Completa el formulario:
   - Username (nombre de usuario)
   - Email
   - Contraseña
4. Verifica tu email
5. Completa el cuestionario inicial (puedes saltarlo si quieres)

---

## Paso 2: Crear el Repositorio

### Opción A: Desde la Web de GitHub (Más Fácil)

1. **Inicia sesión en GitHub:**
   - Ve a https://github.com
   - Inicia sesión con tu cuenta

2. **Crea un nuevo repositorio:**
   - Click en el botón **"+"** (arriba a la derecha)
   - Selecciona **"New repository"**

3. **Configura el repositorio:**
   - **Repository name:** `viajeia` (o el nombre que prefieras)
   - **Description (opcional):** "Asistente personal de viajes con IA"
   - **Visibility:**
     - ✅ **Public** (cualquiera puede verlo) - RECOMENDADO para empezar
     - ⚠️ **Private** (solo tú puedes verlo) - Requiere plan de pago para algunas funciones
   - **IMPORTANTE:** NO marques ninguna de estas opciones:
     - ❌ NO marques "Add a README file"
     - ❌ NO marques "Add .gitignore"
     - ❌ NO marques "Choose a license"
   - (Dejamos estas sin marcar porque ya tienes archivos en tu proyecto)

4. **Click en "Create repository"**

5. **GitHub te mostrará una página con instrucciones** - ¡No las sigas todavía! Ya tenemos el código local.

---

## Paso 3: Conectar tu Código Local con GitHub

Abre tu terminal y ejecuta estos comandos:

```bash
# 1. Ve a la carpeta de tu proyecto
cd /Users/wilmaraspiazuhurtado/Documents/ViajeIA

# 2. Inicializa Git (si no lo has hecho)
git init

# 3. Agrega todos los archivos
git add .

# 4. Crea el primer commit
git commit -m "Initial commit: ViajeIA - Asistente de viajes con IA"

# 5. Conecta con GitHub (reemplaza TU_USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/viajeia.git

# 6. Cambia el nombre de la rama principal a "main"
git branch -M main

# 7. Sube tu código a GitHub
git push -u origin main
```

**Nota:** En el paso 5, reemplaza `TU_USUARIO` con tu nombre de usuario real de GitHub.

Por ejemplo, si tu usuario es `juanperez`, el comando sería:
```bash
git remote add origin https://github.com/juanperez/viajeia.git
```

---

## Paso 4: Autenticación en GitHub

Cuando ejecutes `git push`, GitHub te pedirá autenticarte:

### Opción 1: Personal Access Token (Recomendado)

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Dale un nombre como "ViajeIA Local"
4. Selecciona el scope `repo` (todos los permisos de repositorio)
5. Click en "Generate token"
6. **¡COPIA EL TOKEN INMEDIATAMENTE!** (solo se muestra una vez)
7. Cuando Git te pida la contraseña, pega el token

### Opción 2: GitHub CLI (Más Fácil a Largo Plazo)

```bash
# Instala GitHub CLI (si no lo tienes)
brew install gh

# Autentica
gh auth login

# Sigue las instrucciones en pantalla
```

---

## Paso 5: Verificar que Funcionó

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/viajeia`
2. Deberías ver todos tus archivos allí
3. ¡Listo! Tu código está en GitHub

---

## Comandos Útiles para el Futuro

### Subir cambios nuevos:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver el estado de tus archivos:
```bash
git status
```

### Ver qué archivos cambiaron:
```bash
git diff
```

---

## Solución de Problemas

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/viajeia.git
```

### Error: "Authentication failed"
- Verifica que tu token de acceso sea correcto
- Asegúrate de tener permisos `repo` en el token

### Error: "Permission denied"
- Verifica que el nombre del repositorio sea correcto
- Asegúrate de que el repositorio exista en GitHub
- Verifica que tengas permisos de escritura

---

## ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que Git esté instalado: `git --version`
2. Verifica que estés en la carpeta correcta
3. Revisa que el repositorio exista en GitHub
4. Asegúrate de haber copiado correctamente la URL del repositorio

¡Buena suerte! 🚀

