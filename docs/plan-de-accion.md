# Plan de acción de NEXUS AI

Fecha: 18 de noviembre de 2026.  
Origen: `PLAN_NEXUS_AI (1).md` y `PLAN_NEXUS_APP_ESCRITORIO.md`.  
Estado del disco: hay API, historial en SQLite, conexión con Ollama (`qwen3:4b`) y una página sin diseño para probar el chat. No hay repositorio Git en la raíz.

Este archivo es el orden de trabajo. La especificación larga sigue en los dos planes. Si una decisión aparece allí como `TODO`, aquí se deja abierta o se anota una recomendación; no se da por cerrada.

---

## Dónde estamos

NEXUS AI quiere ser un asistente personal que corre en el ordenador, guarda los datos ahí y, más adelante, permite entrar desde otro dispositivo. La primera versión usable es más pequeña: conversar con un modelo local, recuperar el historial y usar como mínimo una herramienta acotada.

En el Mac de trabajo (Apple M1, macOS 14.6) ya están Git, Homebrew, Node 22, npm, uv, Python 3.12 y Ollama. El Python del sistema sigue siendo 3.9.6; el proyecto no lo usa. Ollama informa 16 GB de memoria unificada. El modelo en uso es `qwen3:4b`, el tamaño ligero pedido para un equipo de 8 GB.

## Decisiones que ya se pueden usar

| Tema | Decisión de trabajo | Dónde queda escrita |
| --- | --- | --- |
| Lenguaje del núcleo | Python 3.12+, gestionado con uv | [adr/0001-python-en-el-backend.md](adr/0001-python-en-el-backend.md) |
| Lenguaje de la interfaz | TypeScript, React y Vite | El mismo ADR |
| API | FastAPI en `127.0.0.1:8000` | Plan general, sección 2 |
| Modelo | Ollama en local. Nombre concreto según la memoria del equipo | `.env.example` propone `qwen3:4b` para un Mac de 8 GB |
| Datos del MVP | Un archivo SQLite, con SQLAlchemy y Alembic | Plan general, sección 2 |
| Carpeta del proyecto | La actual, `nexus`. El nombre de producto sigue siendo NEXUS AI | Esta nota |

## Decisiones que siguen abiertas

No bloquean el backend. Sí bloquean, cada una, la fase indicada.

1. **Web local o app de escritorio como primera pantalla.** La página actual es una comprobación sin diseño. La app de escritorio sigue para cuando el chat ya esté estable.
2. **Dirección visual** (paleta, tema claro/oscuro, tipografía). Sigue abierta. La página de prueba no lleva estilos.
3. **Chroma o Qdrant** para los documentos. Se decide con una prueba pequeña en la fase de RAG, no ahora.
4. **Tamaño del modelo.** Queda `qwen3:4b`. Ollama ve 16 GB en este M1; se mantiene el modelo ligero.
5. **Licencia y si el repositorio nace público o privado.** Antes del primer push. El plan recomienda no esperar a tener el producto terminado, y sí esperar a que el primer commit esté limpio de datos personales.
6. **Si el instalador de escritorio llevará el backend dentro o lo pedirá aparte.** Fase de empaquetado, no ahora. Tauri no empaqueta Python solo.

---

## Orden de construcción

Cada fase termina con algo que se puede arrancar, con una prueba básica y con la documentación tocada si la decisión cambió. No se salta de fase con la anterior rota.

### Ahora — dejar el ordenador y el repo listos

Objetivo: otra persona clona o copia la carpeta, sigue [arranque-local.md](arranque-local.md) y no necesita archivos privados.

- [x] Redactar la guía de arranque, este plan y el ADR del lenguaje.
- [x] Añadir `.gitignore` y `.env.example` sin secretos.
- [x] Instalar uv, Python 3.12 y Ollama. Modelo: `qwen3:4b`.
- [ ] Inicializar Git en la raíz de `nexus`. Antes, borrar la carpeta `backend/.git` que creó `uv` al iniciar el paquete: si se queda, Git no versionará el servidor.
- [x] Primera pantalla: web local, sin diseño, solo para comprobar el chat.
- [ ] Elegir licencia, o dejar `LICENSE` fuera hasta decidirla. No publicar sin esa decisión.
- [ ] Primer commit pequeño. Mensaje orientativo: `chore: initialize nexus ai project`.

No entra en el primer commit: Tauri, RAG y login. FastAPI y la página de prueba ya están.

### Fase 1 — una pregunta y una respuesta

Hecho en esta pasada. `POST /api/v1/chat` devuelve texto de Ollama. Si Ollama está apagado, la API explica el fallo.

### Fase 2 — que el chat sobreviva al cerrar

Hecho lo necesario para probarlo: prompt en español, tablas de conversación y mensaje, dueño fijo `local` que el cliente no puede suplantar, borrado de una conversación y la migración inicial de Alembic.

Pendiente de esta fase: preferencias, recuerdos editables y política de retención.

### Fase 3 — pantalla

Hay una página en `frontend/` sin estilos: lista, envío, respuesta, error, estado de Ollama y borrado en dos pasos. Sirve para comprobar el servidor.

Sigue pendiente el diseño (tema, tipografía, navegación) y el streaming.

### Fase 4 — herramientas con permiso

Objetivo: el modelo propone una acción y el servidor solo ejecuta funciones registradas.

Primera herramienta: calculadora, o tareas internas. Después, fecha y hora, lectura de una carpeta autorizada y escritura en una carpeta de salida.

No existirá una herramienta genérica de terminal. Escribir, borrar o enviar algo pide confirmación. El texto encontrado dentro de un documento se trata como dato, nunca como una orden al sistema.

### Fase 5 — preguntas sobre documentos

Objetivo: responder con el nombre del archivo y la página, o decir que no hay base suficiente.

Elegir formatos y tamaño máximo, extraer texto, trocear, embeddings multilingües (el uso previsto es en español) y un índice local. Chroma o Qdrant se decide con una prueba, no por preferencia previa.

### Fase 6 — automatizaciones pequeñas

Recordatorios, una hora concreta, un resumen de documentos elegidos, una rutina lanzada a mano. APScheduler o una cola simple. Cada automatización tiene dueño, zona horaria, historial y forma de pausarla. n8n y Celery se quedan fuera hasta que este esquema se quede corto.

### Fase 7 — agentes, solo con un caso real

Investigador, documentalista, organizador, analista, programador son candidatos, no una obligación de construir los cinco. Primero un coordinador sencillo y un contrato común. LangGraph o PydanticAI se valoran cuando haya al menos dos flujos de verdad.

### Después del MVP — escritorio

El plan de escritorio (Tauri 2, la misma interfaz React, macOS y Windows) empieza cuando el chat web ya guarda historial.

Orden interno de ese plan: prototipo de ventana, sistema visual, chat con streaming, arranque del backend, documentos, calendario, voz, y al final firma e instaladores.

En el Mac, Calendario y Recordatorios de Apple solo se pueden leer desde el propio Mac (EventKit). Un servidor en otro sitio no llega a esos datos. Google Calendar, si se hace, va con OAuth y el mínimo de permisos.

Rust, Cargo y el empaquetado de Python (PyInstaller o Nuitka, a evaluar) aparecen en esta etapa. Durante el desarrollo, FastAPI se sigue lanzando en una terminal aparte.

### Más adelante — cuentas y otro dispositivo

Los clientes hablan con una API central. No se sincronizan archivos SQLite a mano. PostgreSQL para los datos, almacén de ficheros privado, índice vectorial filtrado por persona, HTTPS e identidad comprobada en el servidor (Authentik o Keycloak, a evaluar).

Antes de ofrecer eso a otra persona en la UE hay que cerrar privacidad, retención, borrado, exportación y recuperación de cuenta.

---

## Qué es el MVP y qué no

El MVP está listo cuando alguien sigue el README en un ordenador limpio, Ollama responde, la interfaz conserva las conversaciones, se pueden borrar, la personalidad se puede editar, hay una herramienta segura y las pruebas básicas pasan.

Quedan fuera de esa meta: RAG, automatizaciones, agentes, login, sincronización y la app instalable.

## Cómo se trabaja cada cambio

- Un cambio pequeño, que deja el proyecto arrancable.
- Pruebas de lo que se toca. Al cerrar la fase: `uv run pytest`, Ruff y mypy.
- Secretos solo en `.env`. Los logs no guardan mensajes privados, documentos ni tokens.
- Si una tarea choca con un `TODO`, se escribe la propuesta (ventajas, inconvenientes, recomendación) y se sigue con lo que no dependa de ella.
- Commits con motivo, del estilo `feat: add local LLM integration`. Nada de “cambios” o “arreglos”.

## Siguiente bloque concreto

1. Borrar `backend/.git` e inicializar Git en la raíz. Revisar que `.env` y `data/` no entren en el commit.
2. Elegir licencia antes de publicar.
3. Siguiente función de producto: una herramienta acotada (calculadora o tareas), o la pantalla de recuerdos. El diseño visual sigue esperando.
