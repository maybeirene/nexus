# NEXUS AI --- Plan de construcción

## Documento maestro para GitHub Copilot / Cursor

> **Objetivo:** construir desde cero un asistente personal de IA,
> inicialmente para uso individual y ejecución local en Windows, con
> arquitectura preparada para incorporar usuarios, inicio de sesión y
> sincronización entre dispositivos en una versión posterior.
>
> **Estado:** plan inicial. Las decisiones marcadas como `TODO` deben
> resolverse durante el proyecto. No asumirlas ni inventarlas.
>
> **Idioma de la aplicación:** español inicialmente, con arquitectura
> preparada para internacionalización.
>
> **Nombre provisional:** NEXUS AI.

------------------------------------------------------------------------

## 0. Instrucciones para Copilot / Cursor

Este documento es la especificación funcional y técnica de referencia
del proyecto.

### Reglas de trabajo

1.  Antes de modificar archivos, inspecciona el repositorio y resume su
    estado.
2.  Implementa el proyecto por fases y tareas pequeñas. No intentes
    construir todas las funciones de una vez.
3.  Mantén la aplicación ejecutable al final de cada fase.
4.  No inventes requisitos cuando haya un `TODO`: pregunta o deja una
    decisión documentada.
5.  Prioriza código sencillo, tipado, modular, testeable y mantenible.
6.  No añadas dependencias sin justificar su necesidad.
7.  Mantén secretos, claves API y credenciales fuera del repositorio.
8.  No ejecutes comandos destructivos ni borres datos sin confirmación
    explícita.
9.  No permitas que el modelo ejecute comandos de shell arbitrarios. Las
    herramientas deben ser funciones explícitas, limitadas y validadas.
10. Añade pruebas para cada función relevante y actualiza este documento
    cuando cambien decisiones.
11. Usa migraciones para cambios de esquema de base de datos.
12. No registres contraseñas, tokens, contenido privado de documentos ni
    secretos en logs.
13. Si una tarea depende de una decisión pendiente, crea una propuesta
    con ventajas, inconvenientes y recomendación; no bloquees el resto
    del trabajo.
14. Antes de terminar cada fase, ejecuta las pruebas, el linter y el
    formateador disponibles y comunica los resultados.

### Entregables que debe mantener el agente de programación

-   Código fuente funcional.
-   `README.md` con instalación, ejecución y solución de problemas.
-   `.env.example` sin secretos reales.
-   `pyproject.toml` o archivos de dependencias equivalentes.
-   Pruebas automatizadas.
-   Documentación de arquitectura y decisiones (`docs/adr/`).
-   Este plan actualizado con las tareas completadas.

------------------------------------------------------------------------

# 1. Visión del producto

NEXUS AI será un asistente personal que conversa con el usuario y puede
utilizar herramientas controladas para ayudarle a:

-   Resolver dudas y redactar contenido.
-   Consultar documentos personales mediante RAG.
-   Buscar información en fuentes web cuando se habilite esa capacidad.
-   Gestionar tareas y recordatorios.
-   Ejecutar automatizaciones autorizadas.
-   Delegar trabajos en agentes especializados.
-   Mantener memoria y preferencias por usuario.
-   En una versión futura, iniciar sesión desde varios dispositivos y
    recuperar los datos personales sincronizados.

## 1.1 Principios

-   **Local-first en la primera versión:** el modelo y los datos
    principales se ejecutan/guardan en el ordenador.
-   **Privacidad por defecto:** no enviar documentos a servicios
    externos sin decisión explícita del usuario.
-   **Control humano:** pedir confirmación antes de acciones externas,
    destructivas o con efectos importantes.
-   **Modularidad:** separar interfaz, API, lógica del agente, modelos,
    memoria y herramientas.
-   **Evolución sin rehacer:** preparar límites claros entre cliente y
    servidor para permitir despliegue remoto y multiusuario.
-   **Transparencia:** mostrar cuándo una respuesta procede del modelo,
    de documentos recuperados o de una herramienta.

## 1.2 Fuera del alcance de la primera versión

No construir inicialmente:

-   Entrenamiento de un modelo fundacional desde cero.
-   Acceso ilimitado al sistema operativo.
-   Ejecución autónoma de comandos arbitrarios.
-   Sincronización multiusuario real.
-   Aplicaciones móviles nativas.
-   Marketplace de plugins.
-   Automatizaciones que envíen mensajes o gasten dinero sin
    confirmación.

------------------------------------------------------------------------

# 2. Decisiones técnicas propuestas

Estas son recomendaciones iniciales, no requisitos inamovibles.
Registrar los cambios en `docs/adr/`.

  -----------------------------------------------------------------------
  Área                    Propuesta inicial       Motivo
  ----------------------- ----------------------- -----------------------
  Lenguaje backend        Python 3.12+            Ecosistema de IA y
                                                  facilidad de desarrollo

  Entorno/dependencias    `uv`                    Entornos reproducibles
                                                  y gestión rápida

  API                     FastAPI                 API HTTP tipada y
                                                  documentación OpenAPI

  Modelo local            Ollama                  Ejecutar modelos
                                                  localmente y exponer
                                                  API

  Modelo inicial          Qwen 3, tamaño según    Probar capacidades y
                          RAM/VRAM                consumo en el equipo
                                                  real

  Persistencia MVP        SQLite + SQLAlchemy     Simple para un usuario
                                                  local

  Migraciones             Alembic                 Evolución controlada
                                                  del esquema

  Interfaz inicial        React + TypeScript +    Permite web local y
                          Vite, decisión          reutilización posterior
                          pendiente               

  Estilos                 TODO: definir sistema   No imponer estética
                          visual                  antes de decidirla

  RAG MVP                 ChromaDB o Qdrant       Índice vectorial local
                          local, decisión         
                          pendiente               

  Pruebas                 pytest + pruebas de API Calidad y regresiones

  Contenedores            Docker Compose opcional Facilitar servicios
                                                  auxiliares y despliegue
                                                  futuro
  -----------------------------------------------------------------------

### 2.1 Decisión de interfaz: web local o aplicación Windows

**No cerrar esta decisión sin revisar preferencias y necesidades.**
Preparar la arquitectura para ambas opciones:

-   **Opción A --- Web local:** frontend servido en el navegador,
    backend en `localhost`. Es la opción recomendada para el MVP por
    simplicidad y facilidad de desarrollo.
-   **Opción B --- Escritorio Windows:** empaquetar más adelante la
    interfaz web con Tauri (o evaluar alternativa equivalente). El
    backend local puede seguir siendo Python.
-   **Opción C --- Híbrida:** web local primero y wrapper de escritorio
    después.

**Recomendación:** empezar con una web local responsive. No desarrollar
dos interfaces. Mantener la API independiente para poder empaquetar el
frontend como escritorio en otra fase.

TODO: - \[ \] Elegir web local, escritorio Windows o enfoque híbrido. -
\[ \] Decidir si la aplicación debe arrancar automáticamente con
Windows. - \[ \] Decidir si necesita bandeja del sistema y
notificaciones nativas. - \[ \] Definir si debe funcionar sin conexión a
Internet (excepto funciones web). - \[ \] Definir el método de
distribución/actualización si se empaqueta como escritorio.

### 2.2 Estilos y experiencia de usuario

No fijar todavía colores, tipografía ni estética. Crear primero un
sistema de diseño mínimo y validarlo con el usuario.

TODO de diseño: - \[ \] Elegir dirección visual: minimalista,
profesional, futurista, cálida u otra. - \[ \] Elegir tema claro, oscuro
o ambos. - \[ \] Definir paleta de color y tokens semánticos. - \[ \]
Definir tipografía, escala de tamaños y espaciado. - \[ \] Definir
radios, bordes, sombras y estados de foco. - \[ \] Diseñar navegación
principal: chat, documentos, tareas, automatizaciones, ajustes. - \[ \]
Diseñar vista de conversación y estados de carga/error. - \[ \] Diseñar
selector de modelo y estado del modelo local. - \[ \] Diseñar gestión de
fuentes/citas en respuestas RAG. - \[ \] Diseñar pantalla de memoria:
ver, corregir y borrar datos. - \[ \] Diseñar confirmaciones de acciones
sensibles. - \[ \] Diseñar accesibilidad: teclado, contraste, lectores
de pantalla y tamaños. - \[ \] Prototipar en baja fidelidad antes de
implementar los detalles visuales.

------------------------------------------------------------------------

# 3. Arquitectura lógica

``` text
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE / INTERFAZ                         │
│       React + TypeScript (web local en el MVP)                │
│       TODO: posible empaquetado Windows con Tauri             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / SSE
┌──────────────────────────────▼──────────────────────────────┐
│                       API BACKEND                             │
│                         FastAPI                                │
│  Autenticación futura | Conversaciones | Documentos | Tareas  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     NÚCLEO DEL AGENTE                         │
│  Orquestador | Prompt | Contexto | Políticas | Tool registry  │
└──────────┬────────────────┬───────────────────┬──────────────┘
           │                │                   │
┌──────────▼───────┐ ┌──────▼────────┐ ┌────────▼─────────────┐
│ Modelo LLM       │ │ Memoria       │ │ Herramientas        │
│ Ollama           │ │ SQLite        │ │ Archivos, tareas,   │
│ interfaz adapter │ │ futuro Postgres│ │ búsqueda, RAG       │
└──────────────────┘ └───────────────┘ └──────────────────────┘

Servicios futuros:
- RAG: extracción -> fragmentación -> embeddings -> índice -> recuperación
- Automatizaciones: scheduler/cola de trabajos -> ejecución de herramientas
- Agentes especializados: coordinador -> agentes con alcance limitado
- Multiusuario: identidad -> autorización -> datos aislados por usuario
```

## 3.1 Estructura de repositorio propuesta

``` text
nexus-ai/
├── README.md
├── PLAN.md
├── .gitignore
├── .env.example
├── pyproject.toml
├── uv.lock
├── backend/
│   ├── pyproject.toml              # si se separa el workspace
│   ├── app/
│   │   ├── main.py                 # inicialización FastAPI
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── logging.py
│   │   │   └── security.py
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── agent/
│   │   │   ├── orchestrator.py
│   │   │   ├── prompts.py
│   │   │   ├── context.py
│   │   │   └── tool_registry.py
│   │   ├── llm/
│   │   │   ├── base.py
│   │   │   └── ollama_provider.py
│   │   ├── memory/
│   │   ├── tools/
│   │   ├── documents/
│   │   ├── automations/            # fase futura
│   │   ├── agents/                 # fase futura
│   │   ├── db/
│   │   └── schemas/
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── services/
│   │   └── styles/
│   └── tests/
├── data/                           # datos locales, no versionar
│   ├── nexus.db
│   ├── documents/
│   └── vector_store/
├── docs/
│   ├── architecture.md
│   ├── security.md
│   └── adr/
└── scripts/
```

No es obligatorio crear todos los directorios desde el primer día.
Añadirlos cuando se implemente cada módulo.

------------------------------------------------------------------------

# 4. Preparación del entorno desde cero

## 4.1 Instalar herramientas

Descargas oficiales:

-   Python: https://www.python.org/downloads/
-   uv: https://docs.astral.sh/uv/getting-started/installation/
-   Git: https://git-scm.com/downloads
-   Node.js LTS: https://nodejs.org/en/download/
-   Ollama: https://ollama.com/download
-   Visual Studio Code: https://code.visualstudio.com/Download
-   Cursor (opcional): https://cursor.com/
-   GitHub Copilot (opcional): https://github.com/features/copilot

Para el desarrollo inicial, instalar Python, uv, Git, Node.js y Ollama.
VS Code o Cursor son el editor, no un requisito de ejecución.

### Comprobación de instalación

En PowerShell:

``` powershell
python --version
uv --version
git --version
node --version
npm --version
ollama --version
```

Si Windows no reconoce un comando, cerrar y volver a abrir la terminal y
comprobar que el instalador añadió la herramienta al `PATH`.

## 4.2 Crear el proyecto

En PowerShell:

``` powershell
mkdir nexus-ai
cd nexus-ai

git init
uv init --package backend
```

Si `uv init --package backend` no crea la estructura esperada por la
versión instalada, usar:

``` powershell
mkdir backend
cd backend
uv init
cd ..
```

Crear carpetas iniciales:

``` powershell
mkdir frontend, docs, scripts, data
mkdir docs\adr
```

Crear `.gitignore` en la raíz:

``` gitignore
# Python
__pycache__/
*.py[cod]
.venv/
.pytest_cache/
.mypy_cache/
.ruff_cache/

# Environment / secrets
.env
.env.*
!.env.example

# Local data
data/
*.db
*.sqlite
*.sqlite3
vector_store/

# Frontend
node_modules/
dist/
build/

# Editors / OS
.vscode/
.idea/
.DS_Store
Thumbs.db
```

Crear `.env.example` (sin secretos reales):

``` dotenv
APP_ENV=development
APP_HOST=127.0.0.1
APP_PORT=8000
DATABASE_URL=sqlite:///./data/nexus.db
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:8b
LOG_LEVEL=INFO
```

Crear un entorno virtual e instalar dependencias:

``` powershell
uv venv
uv add fastapi "uvicorn[standard]" pydantic-settings sqlalchemy alembic httpx
uv add --dev pytest pytest-asyncio ruff mypy
```

> Si se ha inicializado un paquete dentro de `backend/`, ejecutar estos
> comandos desde esa carpeta. Elegir una sola estrategia de workspace y
> documentarla; no duplicar entornos virtuales innecesariamente.

## 4.3 Instalar Ollama y descargar un modelo

Instalar desde https://ollama.com/download.

En PowerShell:

``` powershell
ollama pull qwen3:8b
ollama run qwen3:8b
```

Para salir de la conversación interactiva, usar `/bye`.

Si el equipo tiene poca RAM o memoria gráfica, elegir un modelo más
pequeño disponible en la biblioteca oficial: https://ollama.com/library.
El tamaño de modelo debe decidirse después de conocer RAM, GPU/VRAM y
sistema operativo.

Comprobar que Ollama responde:

``` powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

La API local de Ollama normalmente no requiere una clave API. No exponer
el puerto de Ollama a Internet.

------------------------------------------------------------------------

# 5. Fases de implementación y To-Dos

## Fase 0 --- Definición y arranque del repositorio

**Objetivo:** crear un repositorio limpio, entorno reproducible y
decisiones registradas.

-   [ ] Crear repositorio Git `nexus-ai`.
-   [ ] Crear estructura inicial.
-   [ ] Añadir `.gitignore`.
-   [ ] Añadir `.env.example`.
-   [ ] Añadir `README.md` y este `PLAN.md`.
-   [ ] Instalar Python, uv, Git, Node.js y Ollama.
-   [ ] Confirmar versiones y registrar entorno.
-   [ ] Crear primer commit.
-   [ ] Crear `docs/adr/0001-arquitectura-inicial.md`.
-   [ ] Registrar decisión provisional de web local para MVP.
-   [ ] Registrar TODOs de estilo e interfaz.

Commit sugerido:

``` powershell
git add .
git commit -m "chore: initialize nexus ai project"
```

## Fase 1 --- Backend mínimo y conexión al LLM

**Objetivo:** enviar una pregunta al backend y recibir una respuesta del
modelo local.

### Implementación

-   [ ] Crear aplicación FastAPI.
-   [ ] Crear configuración con Pydantic Settings.
-   [ ] Crear interfaz `LLMProvider`.
-   [ ] Implementar `OllamaProvider`.
-   [ ] Crear endpoint `GET /health`.
-   [ ] Crear endpoint `GET /api/v1/models`.
-   [ ] Crear endpoint `POST /api/v1/chat`.
-   [ ] Validar mensajes y límites de tamaño.
-   [ ] Gestionar timeout, modelo no disponible y errores de conexión.
-   [ ] Añadir pruebas unitarias con proveedor simulado.
-   [ ] Añadir prueba de integración opcional con Ollama real.

### Contrato inicial orientativo

`POST /api/v1/chat`

Petición:

``` json
{
  "conversation_id": null,
  "message": "Hola, ¿quién eres?"
}
```

Respuesta:

``` json
{
  "conversation_id": "uuid",
  "message": "Soy NEXUS, tu asistente personal."
}
```

No guardar todavía información sensible ni implementar acciones
externas.

### Ejecutar backend

Desde el directorio que contenga la aplicación Python:

``` powershell
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Documentación interactiva:

-   http://127.0.0.1:8000/docs
-   http://127.0.0.1:8000/health

**Criterio de aceptación:** con Ollama activo, una petición HTTP obtiene
una respuesta del modelo; si Ollama está apagado, la API devuelve un
error controlado y comprensible.

## Fase 2 --- Personalidad, conversación y memoria

**Objetivo:** definir NEXUS y conservar conversaciones localmente.

-   [ ] Crear `prompts.py` con prompt del sistema versionado.
-   [ ] Definir personalidad, idioma, tono y límites.
-   [ ] Crear modelos SQLAlchemy para conversación y mensaje.
-   [ ] Configurar SQLite.
-   [ ] Configurar Alembic.
-   [ ] Persistir conversaciones y mensajes.
-   [ ] Recuperar historial al abrir una conversación.
-   [ ] Añadir eliminación de conversaciones.
-   [ ] Separar memoria de conversación de memoria de perfil.
-   [ ] Permitir consultar, editar y borrar recuerdos.
-   [ ] Añadir política de retención y exportación de datos.
-   [ ] Probar aislamiento entre conversaciones.

**Esquema inicial sugerido:**

-   `conversations`: id, title, created_at, updated_at.
-   `messages`: id, conversation_id, role, content, created_at.
-   `user_preferences`: id, key, value, updated_at.
-   `memories`: id, content, category, source, created_at, updated_at.

Aunque el MVP tenga un solo usuario, introducir una abstracción de
propietario (`owner_id` o equivalente) en las entidades personales para
facilitar la futura separación multiusuario. No crear autenticación
falsa ni confiar en un `user_id` enviado libremente por el cliente.

## Fase 3 --- Interfaz de usuario inicial

**Objetivo:** usar NEXUS desde una interfaz cómoda.

### Propuesta técnica

-   React + TypeScript + Vite.
-   Comunicación con FastAPI mediante un cliente API.
-   Diseño responsive para escritorio.
-   Streaming de respuestas como mejora posterior (SSE o mecanismo
    compatible).

### TODOs obligatorios de diseño

-   [ ] Decidir web local o aplicación de escritorio Windows.
-   [ ] Aprobar wireframes de chat, navegación y ajustes.
-   [ ] Definir paleta y tema claro/oscuro.
-   [ ] Definir tipografías y tamaños.
-   [ ] Definir componentes reutilizables y estados.
-   [ ] Definir iconografía.
-   [ ] Definir comportamiento en ventanas pequeñas.
-   [ ] Definir accesibilidad y navegación por teclado.
-   [ ] Definir pantalla de conversaciones.
-   [ ] Definir panel de configuración del modelo.
-   [ ] Definir panel de memoria y privacidad.

### Inicialización frontend (si se confirma React + Vite)

Desde la raíz:

``` powershell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

El servidor de desarrollo mostrará la URL local, habitualmente
`http://localhost:5173`.

### Funciones mínimas de UI

-   [ ] Listado de conversaciones.
-   [ ] Crear conversación.
-   [ ] Enviar mensaje.
-   [ ] Mostrar respuesta y errores.
-   [ ] Mostrar estado de conexión con backend/modelo.
-   [ ] Ajustes básicos.
-   [ ] Eliminar conversación con confirmación.

**Criterio de aceptación:** un usuario puede abrir la interfaz,
conversar con NEXUS, cerrar el navegador y recuperar el historial local.

## Fase 4 --- Herramientas seguras del agente

**Objetivo:** permitir acciones útiles sin conceder acceso ilimitado.

Crear un registro de herramientas explícitas. Cada herramienta debe
declarar nombre, descripción, esquema de entrada, permisos, validación y
resultado.

Herramientas iniciales:

-   [ ] Calculadora.
-   [ ] Fecha y hora local.
-   [ ] Crear y consultar tareas internas.
-   [ ] Leer archivos solo desde carpetas autorizadas.
-   [ ] Crear archivos en una carpeta de salida autorizada.
-   [ ] Buscar en documentos indexados.
-   [ ] Búsqueda web, si el usuario configura un proveedor.

### Reglas de seguridad

-   No implementar una herramienta genérica `run_shell`.
-   No permitir rutas fuera de directorios autorizados.
-   Validar tipo, tamaño y extensión de archivos.
-   Evitar path traversal y enlaces simbólicos peligrosos.
-   Pedir confirmación para escribir, sobrescribir, borrar o enviar
    información.
-   Registrar auditoría de acciones sin guardar secretos.
-   Limitar número de llamadas a herramientas y tiempo de ejecución.
-   Tratar el contenido de documentos y páginas web como datos no
    confiables, nunca como instrucciones del sistema.
-   Separar permisos de lectura y escritura.

**Criterio de aceptación:** el modelo puede proponer una herramienta, el
backend valida sus argumentos y ejecuta únicamente la función registrada
y permitida.

## Fase 5 --- RAG: consulta de documentos

**Objetivo:** permitir preguntas sobre PDF, DOCX, TXT y otros formatos
acordados, con referencias a los fragmentos utilizados.

### Pipeline

``` text
Documento
   ↓
Validación y extracción de texto
   ↓
Limpieza y metadatos
   ↓
Fragmentación (chunks)
   ↓
Modelo de embeddings
   ↓
Base vectorial local
   ↓
Búsqueda semántica
   ↓
Fragmentos relevantes + referencias
   ↓
LLM genera respuesta fundamentada
```

### Componentes a evaluar

-   Extracción: PyMuPDF para PDF; python-docx para DOCX; extracción
    específica para otros formatos.
-   Embeddings: modelo multilingüe local compatible con el idioma
    español.
-   Vector store: ChromaDB o Qdrant local. Elegir uno tras una prueba
    pequeña.
-   RAG: empezar con recuperación simple y filtros por documento;
    incorporar reranking solo si las pruebas lo justifican.

Enlaces:

-   Chroma: https://docs.trychroma.com/
-   Qdrant: https://qdrant.tech/documentation/
-   Sentence Transformers: https://sbert.net/
-   PyMuPDF: https://pymupdf.readthedocs.io/
-   python-docx: https://python-docx.readthedocs.io/

### To-Dos

-   [ ] Definir formatos permitidos y tamaño máximo.
-   [ ] Definir carpeta de documentos y política de almacenamiento.
-   [ ] Extraer texto y metadatos.
-   [ ] Dividir por páginas/secciones y chunks con solapamiento
    configurable.
-   [ ] Elegir embeddings multilingües.
-   [ ] Elegir Chroma o Qdrant.
-   [ ] Guardar relación entre chunk, documento y página.
-   [ ] Implementar búsqueda semántica con filtros.
-   [ ] Añadir citas con nombre de archivo y página/sección.
-   [ ] Evitar afirmar que un documento dice algo si no hay fragmentos
    que lo respalden.
-   [ ] Permitir reindexar y eliminar documentos.
-   [ ] Gestionar documentos duplicados y cambios.
-   [ ] Probar con un conjunto de preguntas cuya respuesta se conozca.
-   [ ] Medir relevancia y detectar respuestas sin respaldo.

**Criterio de aceptación:** NEXUS responde preguntas sobre documentos
propios y muestra qué documento y página respaldan la respuesta. Si no
encuentra evidencia suficiente, debe decirlo.

## Fase 6 --- Automatizaciones

**Objetivo:** ejecutar tareas programadas o disparadas por eventos.

Empezar con automatizaciones internas y reversibles:

-   [ ] Crear recordatorio.
-   [ ] Ejecutar una tarea a una hora concreta.
-   [ ] Resumir documentos seleccionados.
-   [ ] Generar un informe local.
-   [ ] Ejecutar una rutina aprobada manualmente.

Tecnologías a evaluar:

-   APScheduler: https://apscheduler.readthedocs.io/
-   n8n (opcional, servicio separado): https://docs.n8n.io/
-   Celery (solo si se necesita una cola distribuida):
    https://docs.celeryq.dev/

No incorporar todas estas herramientas. Para el MVP de automatizaciones,
usar APScheduler o una cola sencilla. n8n puede añadirse si se desea un
editor visual de flujos.

### Requisitos de seguridad y fiabilidad

-   [ ] Cada automatización tiene propietario, estado y horario.
-   [ ] Definir zona horaria explícitamente.
-   [ ] Guardar ejecuciones y errores.
-   [ ] Evitar ejecuciones duplicadas.
-   [ ] Implementar reintentos limitados.
-   [ ] Permitir pausar, cancelar y eliminar.
-   [ ] Pedir aprobación para acciones externas sensibles.
-   [ ] No ejecutar acciones irreversibles sin confirmación.
-   [ ] Mostrar historial de ejecuciones.

## Fase 7 --- Agentes especializados

**Objetivo:** dividir tareas complejas entre agentes con
responsabilidades concretas.

Agentes candidatos:

1.  **Investigador:** recopila fuentes y prepara resúmenes.
2.  **Documentalista:** consulta la biblioteca RAG.
3.  **Organizador:** tareas, recordatorios y planificación.
4.  **Analista:** procesa datos y genera informes.
5.  **Programador:** ayuda a escribir y revisar código.

### Diseño

-   [ ] Crear contrato común de agente.
-   [ ] Definir instrucciones y herramientas permitidas por agente.
-   [ ] Crear un coordinador que decida si delegar.
-   [ ] Limitar profundidad y número de delegaciones.
-   [ ] Compartir solo el contexto necesario.
-   [ ] Exigir resultados estructurados.
-   [ ] Permitir cancelación y límites de tiempo.
-   [ ] Mantener trazabilidad de qué agente hizo cada acción.
-   [ ] Evitar que los agentes se deleguen tareas indefinidamente.
-   [ ] Comparar un flujo secuencial simple con LangGraph antes de
    añadir complejidad.

Documentación opcional:

-   LangGraph: https://docs.langchain.com/oss/python/langgraph/overview
-   PydanticAI: https://ai.pydantic.dev/

No usar un framework multiagente hasta que existan dos o más flujos
reales que lo justifiquen. Empezar con funciones y un coordinador
sencillo.

------------------------------------------------------------------------

# 6. Versión futura: usuarios, login y sincronización entre dispositivos

**Requisito de producto:** en una versión posterior, distintas personas
podrán crear una cuenta, iniciar sesión desde otro dispositivo y
recuperar sus propias conversaciones, preferencias, documentos y datos.

Esto cambia la arquitectura: los datos ya no pueden depender
exclusivamente de un archivo SQLite guardado en un único ordenador.

## 6.1 Arquitectura futura recomendada

``` text
┌──────────────────┐      ┌──────────────────┐
│ PC Windows       │      │ Otro dispositivo │
│ Web / Desktop    │      │ Web / Desktop    │
└────────┬─────────┘      └────────┬─────────┘
         └────────────┬────────────┘
                      │ HTTPS
              ┌───────▼────────┐
              │ API FastAPI   │
              │ Auth + RBAC   │
              └───────┬────────┘
                      │
          ┌───────────┼────────────┐
          │           │            │
    ┌─────▼────┐ ┌────▼─────┐ ┌────▼─────────┐
    │PostgreSQL│ │Object    │ │Vector store  │
    │datos     │ │storage   │ │por usuario   │
    │usuarios  │ │archivos  │ │/ colección   │
    └──────────┘ └──────────┘ └──────────────┘
```

### Tecnologías a evaluar

-   PostgreSQL: https://www.postgresql.org/
-   SQLAlchemy: https://docs.sqlalchemy.org/
-   Alembic: https://alembic.sqlalchemy.org/
-   Autenticación: proveedor OIDC/OAuth2 o solución de identidad
    gestionada; evaluar Authentik (https://goauthentik.io/) o Keycloak
    (https://www.keycloak.org/).
-   Almacenamiento de archivos: S3 compatible, por ejemplo MinIO
    (https://min.io/), o proveedor gestionado.
-   Despliegue: servidor propio o nube; elegir según presupuesto y
    requisitos de privacidad.

## 6.2 Modelo de datos multiusuario

Preparar las entidades para que, en la versión futura, todas las filas
privadas estén asociadas a un `user_id`:

-   `users`: identidad interna, estado y fechas.
-   `user_profiles`: preferencias y configuración.
-   `conversations`: `user_id`, título y fechas.
-   `messages`: conversación y propietario validado.
-   `memories`: `user_id`, contenido y metadatos.
-   `documents`: `user_id`, metadatos y ubicación de almacenamiento.
-   `document_chunks`: documento, propietario, página y contenido
    indexado.
-   `tasks`: `user_id`, estado y vencimiento.
-   `automations`: `user_id`, configuración y estado.
-   `agent_runs`: propietario, agente, estado y resultado.

### Reglas críticas

1.  La identidad debe proceder de una sesión/token validado en el
    servidor; nunca confiar en un `user_id` arbitrario enviado por el
    frontend.
2.  Aplicar autorización en cada consulta y operación.
3.  Garantizar que un usuario no pueda leer ni modificar datos de otro.
4.  En PostgreSQL, evaluar Row Level Security como defensa adicional.
5.  Cifrar tráfico con HTTPS.
6.  Proteger credenciales con hash de contraseña seguro si se gestionan
    contraseñas propias; preferir un proveedor de identidad mantenido.
7.  Implementar cierre de sesión, caducidad y revocación de sesiones.
8.  Crear exportación y borrado de datos por usuario.
9.  Definir copias de seguridad y restauración probada.
10. No sincronizar secretos locales, claves API ni credenciales de
    herramientas por defecto.
11. Separar datos de usuario de logs operativos.
12. Documentar retención y eliminación de archivos, vectores y copias.

## 6.3 Estrategia de sincronización

Para la primera versión multiusuario, **no sincronizar bases SQLite
entre dispositivos**. Los clientes deben conectarse a una API central
que sea la fuente de verdad.

-   Conversaciones y preferencias: API + PostgreSQL.
-   Archivos: almacenamiento de objetos privado con permisos por
    usuario.
-   Índices vectoriales: guardar metadatos de propietario y filtrar
    siempre por usuario.
-   Estado de sincronización: timestamps/versiones y operaciones
    idempotentes.
-   Conflictos: definir política para cambios concurrentes; no
    sobrescribir silenciosamente.
-   Modelo local: cada dispositivo puede usar Ollama localmente o
    delegar en un servidor de modelos, según una decisión futura.

### TODOs de producto multiusuario

-   [ ] Definir si las cuentas serán solo para uso propio/familiar o
    para público general.
-   [ ] Definir registro abierto, invitaciones o alta administrada.
-   [ ] Definir si cada usuario aporta su propio modelo local o usa un
    servicio central.
-   [ ] Definir qué datos se sincronizan y cuáles permanecen locales.
-   [ ] Definir si se compartirán conversaciones, agentes o documentos.
-   [ ] Definir recuperación de cuenta y MFA.
-   [ ] Definir política de privacidad, retención y eliminación.
-   [ ] Evaluar obligaciones RGPD si se ofrece a otras personas en la
    UE.
-   [ ] Diseñar pruebas de aislamiento entre usuarios.

------------------------------------------------------------------------

# 7. Pruebas, calidad y seguridad

## 7.1 Pruebas mínimas

-   [ ] Pruebas unitarias para configuración, prompts, memoria y
    herramientas.
-   [ ] Pruebas API para endpoints y validaciones.
-   [ ] Pruebas de integración con Ollama.
-   [ ] Pruebas de persistencia y migraciones.
-   [ ] Pruebas RAG con documentos de referencia.
-   [ ] Pruebas de aislamiento de usuarios antes de habilitar
    multiusuario.
-   [ ] Pruebas de permisos de archivos.
-   [ ] Pruebas de automatizaciones duplicadas, fallidas y canceladas.

Comando:

``` powershell
uv run pytest
```

## 7.2 Seguridad mínima antes de usar datos reales

-   [ ] Mantener backend local ligado a `127.0.0.1` en modo local.
-   [ ] No exponer Ollama ni FastAPI directamente a Internet.
-   [ ] No guardar secretos en Git.
-   [ ] Validar entradas y salidas de herramientas.
-   [ ] Limitar tamaño de peticiones, documentos y tiempos de ejecución.
-   [ ] Prevenir path traversal.
-   [ ] No permitir ejecución de shell libre por el LLM.
-   [ ] Confirmar acciones de escritura, borrado o envío externo.
-   [ ] Tratar instrucciones encontradas dentro de documentos como
    contenido no confiable.
-   [ ] Mantener dependencias actualizadas.
-   [ ] Crear copias de seguridad y probar restauración.
-   [ ] Ofrecer borrado y exportación de los datos locales.

------------------------------------------------------------------------

# 8. Criterios de finalización del MVP

El MVP estará listo cuando:

-   [ ] Se instale siguiendo el README desde un ordenador limpio.
-   [ ] Ollama ejecute el modelo elegido.
-   [ ] La API FastAPI se conecte al modelo.
-   [ ] La interfaz permita mantener conversaciones.
-   [ ] Las conversaciones se guarden localmente.
-   [ ] El usuario pueda borrar conversaciones.
-   [ ] La personalidad y configuración sean editables.
-   [ ] Exista al menos una herramienta segura (calculadora o tareas).
-   [ ] Se muestren errores claros cuando el modelo no esté disponible.
-   [ ] Existan pruebas automatizadas básicas.
-   [ ] No se expongan servicios locales a la red sin configuración
    explícita.

RAG, automatizaciones avanzadas, agentes especializados y multiusuario
son hitos posteriores, no requisitos para declarar terminado el primer
MVP.

------------------------------------------------------------------------

# 9. Orden recomendado de trabajo para Copilot / Cursor

Ejecutar las tareas en este orden:

1.  Inspeccionar el repositorio y detectar sistema operativo/entorno.
2.  Crear estructura, Git, `.gitignore`, `.env.example` y documentación.
3.  Preparar Python/uv y comprobar Ollama.
4.  Implementar FastAPI con `/health`.
5.  Implementar adaptador Ollama y endpoint de chat.
6.  Añadir SQLite, SQLAlchemy y Alembic.
7.  Persistir conversaciones y mensajes.
8.  Crear frontend mínimo después de validar la decisión de interfaz.
9.  Añadir herramienta calculadora y registro de herramientas.
10. Añadir gestión de archivos con permisos limitados.
11. Implementar RAG.
12. Implementar automatizaciones.
13. Implementar agentes especializados solo cuando haya casos de uso
    concretos.
14. Preparar autenticación y PostgreSQL en una versión posterior.
15. Añadir empaquetado Windows si se decide que la experiencia de
    escritorio es prioritaria.

**No avanzar a la fase siguiente si la actual no arranca, no tiene
pruebas básicas o no está documentada.**

------------------------------------------------------------------------

# 10. Enlaces oficiales de referencia

## Entorno y desarrollo

-   Python: https://www.python.org/downloads/
-   uv: https://docs.astral.sh/uv/
-   Git: https://git-scm.com/
-   Node.js: https://nodejs.org/
-   FastAPI: https://fastapi.tiangolo.com/
-   React: https://react.dev/
-   Vite: https://vite.dev/
-   TypeScript: https://www.typescriptlang.org/docs/

## IA local

-   Ollama: https://ollama.com/
-   Descargas Ollama: https://ollama.com/download
-   Biblioteca de modelos: https://ollama.com/library
-   API Ollama: https://docs.ollama.com/api
-   Qwen: https://qwenlm.github.io/

## Datos y RAG

-   SQLAlchemy: https://docs.sqlalchemy.org/
-   Alembic: https://alembic.sqlalchemy.org/
-   SQLite: https://www.sqlite.org/docs.html
-   Chroma: https://docs.trychroma.com/
-   Qdrant: https://qdrant.tech/documentation/
-   Sentence Transformers: https://sbert.net/

## Automatizaciones y agentes

-   APScheduler: https://apscheduler.readthedocs.io/
-   n8n: https://n8n.io/
-   LangGraph: https://docs.langchain.com/oss/python/langgraph/overview
-   PydanticAI: https://ai.pydantic.dev/

## Escritorio y distribución

-   Tauri: https://tauri.app/
-   Electron: https://www.electronjs.org/
-   PyInstaller (si se estudia empaquetar componentes Python):
    https://pyinstaller.org/

## Multiusuario e identidad

-   PostgreSQL: https://www.postgresql.org/
-   Keycloak: https://www.keycloak.org/
-   Authentik: https://goauthentik.io/
-   MinIO: https://min.io/

------------------------------------------------------------------------

# 11. Primer encargo para Copilot / Cursor

Pega este texto en el chat del agente de programación una vez abierto el
repositorio:

> Lee completamente `PLAN.md`. Vamos a construir NEXUS AI desde cero y
> por fases. Primero inspecciona el entorno y el repositorio, comprueba
> qué herramientas están instaladas y señala cualquier incompatibilidad.
> No implementes aún RAG, automatizaciones, multiagente ni autenticación
> multiusuario. Propón la estructura inicial y las decisiones que deban
> confirmarse, especialmente interfaz web local frente a escritorio
> Windows y el sistema visual. Después implementa únicamente la Fase 0:
> estructura, configuración base, Git, `.gitignore`, `.env.example`,
> README y documentación de decisiones. No añadas secretos ni datos
> personales. Ejecuta las comprobaciones posibles y presenta los
> comandos exactos para continuar con la Fase 1.

------------------------------------------------------------------------


------------------------------------------------------------------------

# 12. Publicación en GitHub y preparación como portfolio profesional

## 12.1 Objetivo

NEXUS AI debe desarrollarse desde el principio como un proyecto que se
pueda enseñar públicamente en procesos de selección, entrevistas y
conversaciones técnicas.

El repositorio público debe permitir que otra persona:

- Entienda qué problema resuelve NEXUS AI.
- Revise la arquitectura y el código.
- Compruebe cómo se instala y ejecuta.
- Ejecute una demostración con sus propias credenciales y datos.
- Consulte las decisiones técnicas, pruebas y evolución del proyecto.

**Principio fundamental:** el repositorio puede ser público, pero los
datos personales, credenciales, tokens, bases de datos privadas y
configuraciones locales nunca deben publicarse.

La aplicación debe poder funcionar con una instalación limpia y datos
de demostración, sin depender de los datos personales del desarrollador.

## 12.2 Separación entre repositorio público y entorno privado

### Puede publicarse

- Código fuente propio.
- Documentación técnica y funcional.
- Diagramas de arquitectura.
- Tests automatizados y fixtures sintéticos.
- Componentes de interfaz y recursos gráficos propios.
- Ejemplos de configuración sin secretos.
- Datos ficticios creados expresamente para demostraciones.
- Capturas y vídeos que no muestren información personal.
- Historial de cambios, issues y roadmap.

### Debe permanecer privado

- Claves API, contraseñas, secretos de firma y claves privadas.
- Credenciales OAuth y tokens de acceso o renovación.
- Archivos reales de configuración local (`.env`).
- Bases de datos locales con conversaciones o información personal.
- Calendarios, eventos, tareas y recordatorios reales.
- Documentos privados indexados mediante RAG.
- Ficheros subidos por el usuario y sus índices vectoriales.
- Logs que puedan contener prompts, datos personales o tokens.
- Copias de seguridad y exportaciones de información personal.
- Modelos descargados u otros artefactos grandes que no deban versionarse.

No se debe confiar únicamente en `.gitignore`: antes de cada publicación
hay que revisar qué archivos están preparados para commit.

## 12.3 Archivo `.gitignore`

Crear y mantener un `.gitignore` en la raíz del repositorio. Como punto
de partida, incluir reglas equivalentes a las siguientes y adaptarlas a
la estructura real del proyecto:

```gitignore
# Secrets and local environment
.env
.env.*
!.env.example
secrets/
credentials/
*.pem
*.key
*.p12
*.pfx
token.json
credentials.json

# Local databases and user data
*.db
*.sqlite
*.sqlite3
local_data/
personal_data/
private_uploads/
backups/

# Vector stores and local model artifacts
chroma_db/
qdrant_storage/
vector_db/
models/

# Python
__pycache__/
*.py[cod]
.venv/
venv/
.pytest_cache/
.mypy_cache/
.ruff_cache/
.coverage
htmlcov/

# Frontend
node_modules/
dist/
build/

# IDE and operating system
.vscode/
.idea/
.DS_Store
Thumbs.db
```

Notas importantes:

1. Las reglas deben revisarse para no excluir accidentalmente código,
   migraciones, tests o ejemplos que sí deban publicarse.
2. No usar nombres genéricos como `data/` a ciegas si el proyecto
   necesita versionar datos de ejemplo. Es preferible separar los datos
   sintéticos (`examples/demo_data/`) de los datos privados
   (`local_data/`).
3. `.gitignore` no elimina archivos que ya estén siendo versionados.
4. Antes del primer commit, revisar `git status --short` y el contenido
   del staging area con `git diff --cached --stat` y
   `git diff --cached`.

## 12.4 Configuración de ejemplo: `.env.example`

Publicar un `.env.example` con nombres de variables y valores ficticios
o vacíos. Nunca copiar credenciales reales a este archivo.

Ejemplo inicial (adaptar los nombres a la configuración implementada):

```dotenv
# Application
APP_ENV=development
APP_HOST=127.0.0.1
APP_PORT=8000

# Database: local development
DATABASE_URL=sqlite:///./nexus.db

# Local LLM
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b

# Google Calendar OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Application security
# Generate a unique random value locally; never use this example as-is.
SECRET_KEY=replace-with-a-random-local-secret
```

Incluir en el README instrucciones claras para copiar el ejemplo a
`.env` en Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

La aplicación debe validar al arrancar las variables obligatorias y
mostrar errores comprensibles si faltan. No debe imprimir sus valores
secretos en consola ni en logs.

Para generar secretos locales, utilizar un generador criptográficamente
seguro y no reutilizar valores de ejemplo. Los secretos de producción
deben gestionarse mediante el mecanismo de secretos del entorno de
despliegue, no mediante archivos versionados.

## 12.5 Reglas de seguridad para Git y GitHub

- Nunca subir `.env`, tokens OAuth, claves API, certificados privados
  ni bases de datos reales.
- No incluir secretos en código, tests, fixtures, capturas, documentación
  ni mensajes de commit.
- No registrar tokens, contraseñas, cabeceras de autorización ni
  contenido privado en logs.
- Usar variables de entorno o un gestor de secretos apropiado.
- Solicitar los permisos OAuth mínimos necesarios para cada integración.
- Cifrar los tokens de proveedores externos cuando se persistan.
- No compartir credenciales entre usuarios.
- Mantener los datos de cada usuario aislados en la futura versión
  multiusuario.
- Activar las funciones de detección de secretos disponibles en GitHub
  cuando proceda.
- Revisar dependencias y vulnerabilidades periódicamente.
- No publicar capturas de pantalla sin comprobar antes que no muestran
  nombres, correos, eventos, rutas locales o información privada.

### Si se publica un secreto por accidente

1. Revocar o rotar inmediatamente la credencial afectada en el proveedor.
2. Revisar los logs y el posible uso indebido de la credencial.
3. Eliminar el secreto del código actual y corregir la causa.
4. Revisar el historial Git: borrar el archivo en un commit posterior
   no elimina el secreto de los commits anteriores.
5. Si hace falta reescribir el historial, coordinarlo cuidadosamente y
   volver a rotar el secreto. No asumir que reescribir el historial
   sustituye la revocación.
6. Documentar el incidente sin volver a incluir el valor secreto.

## 12.6 Estructura recomendada del repositorio público

La estructura final puede evolucionar, pero se recomienda tender hacia:

```text
nexus-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── agents/
│   │   ├── llm/
│   │   ├── memory/
│   │   ├── integrations/
│   │   └── tools/
│   └── tests/
├── frontend/
│   ├── src/
│   └── public/
├── docs/
│   ├── architecture.md
│   ├── roadmap.md
│   ├── security.md
│   └── adr/
├── examples/
│   ├── demo_data/
│   └── configurations/
├── scripts/
├── .github/
│   └── workflows/
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
└── CHANGELOG.md
```

No es necesario crear todas las carpetas desde el primer día. Crear
únicamente las que tengan un uso real y ampliar la estructura a medida
que se implementen las fases.

## 12.7 README orientado a portfolio

El `README.md` es la portada del proyecto. Debe estar pensado tanto para
perfiles técnicos como para recruiters o responsables de selección.

Estructura recomendada:

1. **Nombre y resumen:** qué es NEXUS AI y qué problema intenta resolver.
2. **Estado del proyecto:** indicar claramente qué está implementado,
   qué está en desarrollo y qué está planificado.
3. **Características:** listar solo las funciones que realmente existan
   y separar las futuras.
4. **Demostración:** capturas, GIF o vídeo breve sin datos personales.
5. **Arquitectura:** diagrama sencillo de frontend, backend, LLM,
   memoria, almacenamiento e integraciones.
6. **Stack tecnológico:** tecnologías utilizadas y motivo de elección.
7. **Instalación:** requisitos, pasos y comandos reproducibles.
8. **Configuración:** uso de `.env.example` y configuración de servicios.
9. **Tests:** cómo ejecutar las pruebas y qué cubren.
10. **Roadmap:** próximas funcionalidades y estado.
11. **Seguridad y privacidad:** explicar qué datos se guardan localmente
    y cómo se gestionan las credenciales.
12. **Licencia y contribuciones:** condiciones de uso y colaboración.

No presentar funcionalidades planificadas como si ya estuvieran
terminadas. Utilizar estados explícitos, por ejemplo: `Implementado`,
`En desarrollo`, `Planificado` y `Pendiente de decisión`.

### Texto inicial de presentación (borrador)

```markdown
# NEXUS AI

Your personal AI assistant. Your data. Your control.

NEXUS AI es un proyecto de asistente personal basado en inteligencia
artificial, diseñado inicialmente para ejecutarse en local y construido
con una arquitectura modular y extensible.

El objetivo es combinar conversación con modelos de lenguaje,
memoria contextual, recuperación de información (RAG), herramientas
controladas e integraciones externas. La arquitectura se plantea para
poder evolucionar hacia una plataforma multiusuario.

## Estado

Proyecto en desarrollo. Consulta el roadmap para conocer qué
funcionalidades están implementadas y cuáles están planificadas.
```

Actualizar este borrador cuando exista una versión funcional y añadir
capturas reales de la aplicación.

## 12.8 Calidad de ingeniería y flujo de trabajo

Utilizar GitHub para mostrar un proceso de desarrollo ordenado:

- Commits pequeños y descriptivos.
- Ramas por funcionalidad o corrección.
- Pull Requests para cambios relevantes, aunque el proyecto sea
  individual.
- Issues para errores, tareas y propuestas.
- Milestones para agrupar objetivos por fase.
- Tests automatizados antes de integrar cambios.
- GitHub Actions para ejecutar tests, lint y comprobaciones básicas.
- Releases etiquetadas cuando existan versiones utilizables.
- CHANGELOG actualizado con cambios relevantes.
- Documentación de decisiones técnicas mediante ADR
  (Architecture Decision Records).

Ejemplos de mensajes de commit:

```text
feat: add local LLM integration
feat: implement persistent conversation memory
feat: add Google Calendar provider
fix: handle expired OAuth tokens
test: add calendar integration tests
docs: document system architecture
```

Evitar commits vagos como `cambios`, `arreglos` o `proyecto terminado`.

### Automatización mínima recomendada

Configurar un workflow de GitHub Actions que, en cada Pull Request y
push a la rama principal:

1. Instale las dependencias.
2. Ejecute lint y formato en modo de comprobación.
3. Ejecute los tests automatizados.
4. Compruebe tipos cuando la configuración del proyecto lo permita.
5. No requiera credenciales personales para ejecutar los tests básicos.

Los tests de integraciones externas deben utilizar mocks o entornos de
prueba. No incluir tokens reales en GitHub Actions.

## 12.9 Demostración reproducible y datos sintéticos

El repositorio público debe permitir probar NEXUS AI sin acceder a
información personal del desarrollador.

Preparar:

- Datos ficticios para probar conversaciones, memoria y RAG.
- Un calendario de demostración con eventos inventados.
- Documentos sintéticos para las pruebas de recuperación.
- Configuración de ejemplo.
- Un modo demo o instrucciones para iniciar una instalación limpia.
- Tests que no dependan de servicios externos ni de credenciales reales.

Las capturas y vídeos deben realizarse con una cuenta y datos de
demostración. No mostrar notificaciones, nombres, correos, calendarios,
documentos o rutas privadas.

## 12.10 Licencia y propiedad intelectual

Añadir un archivo `LICENSE` cuando se decida cómo se permite reutilizar
el proyecto. La elección debe ser deliberada:

- Una licencia permisiva como MIT facilita reutilización y modificación.
- Apache-2.0 añade condiciones y concesiones explícitas relacionadas
  con patentes.
- Una licencia copyleft como GPL exige compartir determinadas obras
  derivadas bajo sus condiciones.

Antes de elegir, revisar también las licencias de modelos, datasets,
iconos, fuentes, imágenes y dependencias. Que el código propio sea
público no significa que todos los recursos utilizados puedan
redistribuirse libremente.

No añadir al repositorio recursos, modelos o datos de terceros sin
comprobar sus condiciones de uso.

## 12.11 Checklist antes de cada publicación

- [ ] No hay archivos `.env` ni credenciales reales en el commit.
- [ ] No hay tokens OAuth, claves API, certificados o claves privadas.
- [ ] No hay bases de datos, conversaciones ni documentos personales.
- [ ] Los datos de ejemplo son ficticios y están autorizados para su uso.
- [ ] Las capturas y vídeos no muestran información privada.
- [ ] `.gitignore` está actualizado.
- [ ] `.env.example` contiene solo valores ficticios o vacíos.
- [ ] Los tests no necesitan secretos personales.
- [ ] README y documentación reflejan el estado real.
- [ ] Se ha revisado el contenido del staging area.
- [ ] Se han ejecutado tests, lint y comprobaciones disponibles.
- [ ] La licencia y las licencias de recursos externos están revisadas.

Comandos útiles antes del primer commit:

```powershell
git status --short
git diff --cached --stat
git diff --cached
```

Si un archivo privado ya está siendo seguido por Git, añadirlo al
`.gitignore` no basta: hay que retirarlo del índice con cuidado y
comprobar el estado del repositorio antes de publicar.

## 12.12 Plan de publicación por etapas

### Antes del primer push público

1. Crear el repositorio `nexus-ai` en GitHub.
2. Decidir si será público desde el inicio o si se hará primero una
   revisión privada.
3. Preparar `.gitignore` y `.env.example`.
4. Separar los datos privados de los datos sintéticos de demostración.
5. Revisar archivos y staging area.
6. Añadir README inicial, roadmap y documentación básica.
7. Ejecutar las pruebas disponibles.
8. Publicar un primer commit pequeño y limpio.

### Después del primer push

1. Mantener issues y milestones por fases.
2. Añadir CI con GitHub Actions.
3. Publicar capturas y una demo cuando la interfaz esté lista.
4. Crear releases al alcanzar hitos estables.
5. Mantener el README y el roadmap actualizados.
6. Revisar seguridad y dependencias periódicamente.

**Recomendación:** no esperar a que NEXUS AI esté terminado para
publicarlo. Una evolución visible, con commits consistentes, pruebas,
documentación y decisiones técnicas justificadas, puede mostrar mejor
la capacidad de desarrollo que un repositorio grande publicado de golpe.

## 12.13 Cómo presentar NEXUS AI en una entrevista

Preparar dos recorridos de demostración:

### Recorrido técnico

- Explicar la arquitectura y la separación de responsabilidades.
- Mostrar cómo se conecta el backend con el modelo local.
- Explicar memoria, persistencia y RAG cuando estén implementados.
- Enseñar el sistema de herramientas y sus límites de seguridad.
- Mostrar tests, CI y decisiones de diseño.
- Explicar cómo se añadiría un nuevo proveedor de calendario o un
  agente especializado.

### Recorrido de producto

- Explicar qué necesidad cubre el asistente.
- Mostrar una conversación real con datos de demostración.
- Enseñar las funciones que ya están disponibles.
- Explicar qué funcionalidades están en el roadmap.
- Mostrar cómo se instala y se ejecuta.

Describir con precisión qué partes se han desarrollado personalmente,
qué dependencias o servicios externos se han utilizado y qué aspectos
siguen pendientes. No atribuirse funcionalidades que todavía no estén
implementadas.

------------------------------------------------------------------------

# 13. Actualización de la Fase 0: repositorio preparado para GitHub

Añadir estas tareas a la Fase 0 existente:

- [ ] Inicializar Git y comprobar la rama principal.
- [ ] Crear `.gitignore` adaptado a Python, frontend y datos locales.
- [ ] Crear `.env.example` sin valores secretos.
- [ ] Comprobar que bases de datos, documentos y almacenamiento local
      quedan fuera del repositorio.
- [ ] Crear README inicial con descripción, estado y pasos previstos.
- [ ] Crear `docs/architecture.md` y `docs/roadmap.md`.
- [ ] Crear `SECURITY.md` y decidir la licencia antes de la primera
      publicación pública.
- [ ] Añadir datos sintéticos de demostración, si son necesarios.
- [ ] Revisar el staging area antes del primer commit.
- [ ] Preparar CI básica cuando existan tests ejecutables.

**Criterio de aceptación:** una persona debe poder clonar el repositorio,
seguir las instrucciones públicas y preparar una instalación limpia
sin necesitar ningún archivo privado del desarrollador. Ningún secreto
ni dato personal debe formar parte del historial Git.


**Fin del documento.**

Este plan es deliberadamente incremental: primero un asistente local
útil y estable; después RAG, automatizaciones y agentes; finalmente,
cuentas y sincronización multi-dispositivo con una arquitectura segura.
