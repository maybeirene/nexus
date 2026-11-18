# Arrancar NEXUS AI en otro ordenador

Esta guía sirve para dejar un Mac o un PC con Windows preparado para trabajar en NEXUS AI, aunque esa máquina no haya visto el proyecto antes. Está escrita para seguirla de arriba abajo, sin dar por hecho que ya conoces las herramientas.

Hay un servidor local y una pantalla de prueba, sin diseño. La guía deja el ordenador listo y, al final, arranca esos dos procesos. El orden de lo que falta está en el [plan de acción](plan-de-accion.md).

El ordenador donde se redactó esta guía es un Mac con chip Apple M1 y macOS 14.6.1. Más abajo se indica qué ya está instalado ahí y qué falta.

---

## 1. Qué vas a instalar y para qué sirve

Hay dos grupos. El primero hace falta para construir y probar el asistente. El segundo se deja aparcado hasta la fase que lo necesita: instalarlo ahora solo añade ruido.

### Hace falta desde el primer día

| Herramienta | Qué es, en una frase | Para qué la usa NEXUS |
| --- | --- | --- |
| **Git** | Lleva el historial de cambios del proyecto | Copiar el código a otro ordenador y no perder versiones |
| **uv** | Instalador y gestor del entorno Python | Instala Python 3.12, crea una carpeta aislada para las librerías y deja un archivo de bloqueo para que el otro ordenador instale exactamente las mismas versiones |
| **Python 3.12 o superior** | Lenguaje del servidor | API, memoria, documentos y herramientas. Lo instala uv; no hace falta el instalador de python.org si uv funciona |
| **Node.js LTS** (22 o 24) | Entorno para ejecutar JavaScript fuera del navegador | La interfaz (React) se desarrolla y se compila con Node |
| **npm** | Gestor de paquetes de JavaScript | Viene incluido con Node. Descarga React, Vite y el resto de la interfaz |
| **Ollama** | Programa que ejecuta modelos de lenguaje en el propio ordenador | Responde a los mensajes sin enviarlos a un servicio de pago. Escucha en `http://127.0.0.1:11434` |
| **Cursor** o **Visual Studio Code** | Editor donde se lee y se escribe el código | Hace falta para desarrollar. No hace falta para que, el día de mañana, una persona use la aplicación ya construida |

### Librerías del servidor (se instalarán cuando exista el código)

Todavía no hay `pyproject.toml`. Cuando se cree el backend, uv instalará estas librerías. Conviene saber qué hace cada una:

| Librería | Para qué sirve |
| --- | --- |
| **FastAPI** | Define la API HTTP: salud, modelos, chat, más adelante documentos y tareas |
| **Uvicorn** | Proceso que mantiene FastAPI encendido y atiende peticiones en el puerto 8000 |
| **Pydantic Settings** | Lee `.env` y falla con un mensaje claro si falta un dato obligatorio |
| **SQLAlchemy** | Guarda conversaciones y preferencias en una base de datos |
| **Alembic** | Aplica cambios del esquema de la base sin tocar los datos a mano |
| **HTTPX** | Cliente con el que el servidor habla con Ollama |
| **pytest** y **pytest-asyncio** | Ejecutan las pruebas automáticas |
| **Ruff** | Revisa estilo y errores frecuentes de Python |
| **mypy** | Comprueba que los tipos de Python cuadran |

### Librerías de la interfaz (fase 3, todavía no)

| Librería | Para qué sirve |
| --- | --- |
| **React** | Construye las pantallas por componentes |
| **TypeScript** | JavaScript con tipos, para que un cambio de la API se vea en el editor |
| **Vite** | Sirve la interfaz en desarrollo (normalmente `http://127.0.0.1:5173`) y genera la versión compilada |

### Puedes ignorarlo de momento

| Herramienta | Para qué servirá, y cuándo |
| --- | --- |
| **Docker** | Arrancar servicios aparte (PostgreSQL, Qdrant) dentro de un contenedor. El primer asistente usa un archivo SQLite y no necesita Docker |
| **Rust** y **Cargo** | Solo cuando se empaquete la app de escritorio con Tauri. La ventana nativa se escribe en Rust; el asistente sigue en Python |
| **Xcode Command Line Tools** (Mac) | Compiladores que Rust pedirá en ese momento. En el Mac actual ya están instaladas |
| **WebView2** (Windows) | Componente de Microsoft que Tauri usa para dibujar la ventana. Se instala al llegar a la app de escritorio |
| **PostgreSQL, Keycloak, Authentik, MinIO** | Cuentas, login y sincronización entre dispositivos. Versión futura, no el MVP |
| **Chroma** o **Qdrant** | Índice para buscar dentro de documentos. Se elige uno cuando empiece la fase de RAG |
| **n8n, Celery, LangGraph** | Automatizaciones avanzadas y varios agentes. El plan empieza con código propio y, como mucho, APScheduler |

---

## 2. Estado del Mac donde se escribió esta guía

Comprobado el 18 de noviembre de 2026:

| Herramienta | Estado en este Mac |
| --- | --- |
| macOS 14.6.1, Apple M1 (arm64) | Listo |
| Git 2.39.3 | Listo |
| Homebrew 4.6.3 | Listo. Atajo para instalar el resto |
| Node.js 22.23.4 y npm 10.9.9, vía nvm 0.39.1 | Listo. Node 22 sigue siendo una versión LTS válida |
| Xcode Command Line Tools | Listas, para el día de Tauri |
| Docker 29.8.2 | Instalado y no necesario todavía |
| Python del sistema | 3.9.6. Es el Python de macOS. **No lo uses para NEXUS**: el proyecto usa el 3.12 que instala uv |
| uv 0.13.9 y Python 3.12.16 | Listos en `~/.local/bin`. En este macOS 14, Homebrew ya no trae un binario de uv y se usó el instalador oficial |
| Ollama 0.40.16 | Listo. El modelo en uso es `qwen3:4b` |
| Rust | No instalado. Correcto: todavía no toca |

Ollama ve 16 GB de memoria unificada en este M1. Aun así el proyecto usa `qwen3:4b`, el tamaño ligero pedido para un equipo de 8 GB. El comando `python` no existe. `python3` abre el 3.9.6 del sistema. El proyecto se arranca con `uv run`, que usa el 3.12.

---

## 3. Instalar en un Mac

Abre **Terminal**. Si una orden dice `command not found`, cierra la ventana, ábrela otra vez y repite la comprobación: a veces el instalador añade el programa al `PATH` y la terminal vieja no se entera.

### 3.1 Homebrew, Git y Node

En este Mac ya están. En un Mac nuevo:

```bash
# Homebrew, si `brew` no existe
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install git

# Node.js LTS. Si prefieres el mismo método que este Mac, instala nvm
# desde https://github.com/nvm-sh/nvm y luego:
#   nvm install --lts
brew install node
```

`brew install node` deja `node` y `npm` disponibles. Cualquiera de las dos vías vale. No hace falta tener nvm y Homebrew a la vez.

### 3.2 uv y Python 3.12

uv descarga Python 3.12 dentro de su propia carpeta. El Python 3.9 del Mac se queda donde está y no se toca.

```bash
brew install uv
uv python install 3.12
uv python list
```

Tiene que aparecer una línea con `3.12` y la arquitectura `aarch64` (Apple Silicon) o `x86_64` (Mac Intel).

Si no quieres usar Homebrew:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Cierra y abre la terminal, y ejecuta `uv python install 3.12`.

### 3.3 Ollama y un modelo

La vía más clara en el Mac es la aplicación de [ollama.com/download](https://ollama.com/download): se arrastra a Aplicaciones y se abre una vez. También se puede instalar por terminal:

```bash
brew install ollama
```

Abre la aplicación Ollama, o bien deja el servicio escuchando:

```bash
ollama serve
```

En otra ventana de terminal, descarga un modelo. El tamaño depende de la memoria del Mac:

1. Menú Apple → **Ajustes del Sistema** → **General** → **Información** → **Memoria**.
2. Con **8 GB**, usa un modelo de unos 4 mil millones de parámetros. Uno de 8B se queda corto de memoria y el ordenador empieza a usar disco.
3. Con **16 GB o más**, puedes probar el de 8B que propone el plan.

```bash
# Mac con 8 GB
ollama pull qwen3:4b

# Mac con 16 GB o más
ollama pull qwen3:8b
```

`ollama pull` solo descarga. `ollama run qwen3:4b` abre una charla de prueba en la terminal. Para salir, escribe `/bye`.

El modelo ocupa varios gigabytes. Hace falta espacio libre en disco y unos minutos de descarga. Ollama no pide clave API. No abras el puerto 11434 hacia internet.

### 3.4 Editor

Instala [Cursor](https://cursor.com/) o [Visual Studio Code](https://code.visualstudio.com/Download). Abre con él la carpeta del proyecto. El editor no sustituye a uv, Node ni Ollama.

---

## 4. Instalar en Windows

Abre **PowerShell**. Las mismas herramientas, con el instalador de Windows.

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id Astral.Uv -e
winget install --id Ollama.Ollama -e
```

Cierra PowerShell, ábrelo de nuevo y comprueba el apartado 5.

Después:

```powershell
uv python install 3.12
ollama pull qwen3:4b
```

Cambia `qwen3:4b` por `qwen3:8b` si el equipo tiene memoria de sobra (orientativamente 16 GB de RAM, o una GPU con VRAM suficiente). La regla es la misma que en el Mac: si al conversar el equipo se queda sin memoria, baja de tamaño en [ollama.com/library](https://ollama.com/library).

Python desde python.org solo hace falta si `uv python install 3.12` falla. En ese caso, durante la instalación marca **Add python.exe to PATH**.

---

## 5. Comprobar que todo responde

En el Mac (zsh o bash):

```bash
git --version
uv --version
uv python list
node --version
npm --version
ollama --version
curl -s http://127.0.0.1:11434/api/tags
```

En Windows (PowerShell):

```powershell
git --version
uv --version
node --version
npm --version
ollama --version
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

Qué tiene que pasar:

- Cada `--version` imprime un número, no `command not found`.
- `uv python list` incluye 3.12.
- `node --version` es v22 o v24.
- La última orden muestra un JSON con los modelos descargados. Si falla la conexión, Ollama no está en marcha: abre la aplicación o ejecuta `ollama serve`.

`python --version` puede seguir diciendo 3.9, o no existir. Es esperable en macOS. El proyecto no se lanza con ese comando.

---

## 6. Llevar la carpeta a la otra máquina

Hoy no hay repositorio remoto. La carpeta se llama `nexus` y vive, en el Mac de trabajo, en `Documents/nexus`.

Hasta que exista un remoto de Git, copia la carpeta entera (AirDrop, disco, o un zip). Cuando el remoto exista, en el otro ordenador bastará con:

```bash
git clone <url-del-repositorio> nexus
cd nexus
```

No copies estas cosas de un ordenador a otro, aunque más adelante aparezcan. Contienen datos de esa máquina o se regeneran:

- `.env` (secretos y rutas locales)
- `.venv/` y `node_modules/` (se reinstalan)
- `data/`, archivos `.db`, `chroma_db/`, `vector_store/` (conversaciones y documentos)
- la carpeta de modelos de Ollama (se vuelven a bajar con `ollama pull`)

Sí deben ir en la copia: el código, `docs/`, `.env.example`, `.gitignore` y los dos planes.

### Preparar el entorno Python

El archivo `.env` vive en la raíz. Las dependencias del servidor viven en `backend/`.

```bash
cp .env.example .env
# En PowerShell: Copy-Item .env.example .env

cd backend
uv sync
```

`uv sync` lee el bloqueo de dependencias y crea `backend/.venv` con las mismas versiones que en el otro ordenador. No hace falta activar el entorno a mano si usas `uv run`.

Abre `.env` y ajusta `OLLAMA_MODEL` al modelo que hayas descargado. El ejemplo viene con `qwen3:4b`, el tamaño pensado para un equipo de 8 GB.

---

## 7. Arrancar la aplicación

Hacen falta **dos procesos**, más Ollama si no está ya en marcha. Se paran con `Ctrl+C` en su terminal.

Terminal 1, desde `backend/`:

```bash
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Salud: <http://127.0.0.1:8000/health>
- Documentación de la API: <http://127.0.0.1:8000/docs>

Terminal 2, interfaz:

```bash
cd frontend
npm install
npm run dev
```

Vite imprime una dirección, casi siempre <http://127.0.0.1:5173>. Ábrela en el navegador.

Ollama tiene que estar ya en marcha. Si lo apagas, la API debe responder con un error comprensible, no con una página en blanco: ese es el criterio de la fase 1.

El servidor escucha solo en `127.0.0.1`. Eso significa “este ordenador”. No lo cambies a `0.0.0.0` para abrirlo a la red de casa.

### Pruebas

Desde `backend/`:

```bash
uv run pytest
uv run ruff check .
uv run mypy app
```

---

## 8. Problemas frecuentes

**`python` abre la 3.9 o no existe.** Normal en macOS. Instala 3.12 con `uv python install 3.12` y lanza el proyecto con `uv run`.

**La terminal no encuentra `uv` o `ollama` justo después de instalar.** Cierra la terminal y ábrela. En el Mac, si instalaste con el script oficial de uv, el instalador suele indicar que añadas una línea a `~/.zshrc`.

**`curl` a Ollama no conecta.** Ollama no está arrancado. Ábrelo desde Aplicaciones o ejecuta `ollama serve`. Comprueba también que el cortafuegos no esté bloqueando la propia máquina.

**El modelo va lentísimo o el Mac se queda sin memoria.** Para el pull y prueba un modelo más pequeño (`qwen3:4b`, o uno de la biblioteca oficial). El plan no fija el tamaño: manda la memoria real del equipo.

**`npm` no existe, pero `node` sí.** Reabre la terminal. Si usas nvm, la terminal nueva tiene que cargar nvm; si no, `node` y `npm` desaparecen. En este Mac nvm está en `~/.nvm`.

**Quiero usar el proyecto sin internet.** Git, uv y `ollama pull` necesitan red la primera vez. Después, conversar con el modelo ya descargado y con la base local puede hacerse sin conexión. Buscar en la web, más adelante, no.

**En Windows una orden del plan usa rutas con barra invertida.** Los bloques de esta guía marcados como bash usan barra normal y también valen en PowerShell actual. Donde el comando cambia (`Copy-Item`, `Invoke-RestMethod`) está escrito aparte.

---

## 9. Qué no incluye todavía esta versión

- Diseño visual. La página es HTML sencillo para comprobar el chat.
- Herramientas del asistente, documentos, recordatorios y varios agentes.
- La app de escritorio. Primero va esta web local.
- Cuentas de usuario. El primer uso es una sola persona, en un solo ordenador. La base SQLite se crea sola al arrancar el servidor, en `data/nexus.db`.

El orden de construcción está en [plan-de-accion.md](plan-de-accion.md).
