# NEXUS AI

Asistente personal que conversa en el propio ordenador, guarda los datos en local y deja la puerta abierta a una cuenta y a varios dispositivos más adelante.

**Estado:** se puede conversar en local. El servidor guarda el historial en SQLite y usa Ollama con `qwen3:4b`. La página es solo una comprobación, sin diseño. Faltan herramientas, documentos, agentes, login y la app de escritorio.

## Cómo arrancarlo en este ordenador

Hace falta Ollama en marcha (`ollama serve`) y el modelo descargado (`ollama pull qwen3:4b`).

Terminal 1:

```bash
cd backend
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Abre http://127.0.0.1:5173. La API documentada está en http://127.0.0.1:8000/docs.

En otro ordenador, sigue [docs/arranque-local.md](docs/arranque-local.md): instalación de uv, Python 3.12, Node y Ollama, y los mismos dos comandos.

## Por dónde seguir

| Documento | Para qué abrirlo |
| --- | --- |
| [docs/arranque-local.md](docs/arranque-local.md) | Instalar todo y dejar un Mac o un Windows listo para trabajar |
| [docs/plan-de-accion.md](docs/plan-de-accion.md) | En qué orden se construye y qué se deja para después |
| [docs/adr/0001-python-en-el-backend.md](docs/adr/0001-python-en-el-backend.md) | Por qué el núcleo va en Python y la interfaz en TypeScript |
| [PLAN_NEXUS_AI (1).md](<PLAN_NEXUS_AI%20(1).md>) | Especificación funcional y técnica |
| [PLAN_NEXUS_APP_ESCRITORIO.md](PLAN_NEXUS_APP_ESCRITORIO.md) | App de escritorio para macOS y Windows, en una fase posterior |

## Qué habrá cuando exista la primera versión usable

Una página local para conversar, un modelo ejecutado con Ollama, las conversaciones guardadas en una base SQLite de ese ordenador y al menos una herramienta acotada (calculadora o tareas). Documentos (RAG), automatizaciones, varios agentes, login y la app de escritorio vienen después.

## Aviso de privacidad del repositorio

Cuando este carpeta se publique, pueden viajar el código, la documentación y datos inventados de demostración. No deben viajar conversaciones reales, documentos personales, el archivo `.env` ni bases de datos locales.
