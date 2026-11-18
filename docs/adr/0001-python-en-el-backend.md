# ADR 0001 — Python en el núcleo, TypeScript en la interfaz

- Estado: aceptada para el MVP
- Fecha: 2026-11-18

## Decisión

El núcleo de NEXUS (API, orquestador, memoria, documentos, herramientas y automatizaciones) se escribe en **Python 3.12 o superior**.

La interfaz se escribe en **TypeScript** con React y Vite. Más adelante, la misma interfaz puede empaquetarse como aplicación de escritorio con Tauri. Tauri usa Rust solo para la ventana y los permisos del sistema operativo; no sustituye al núcleo.

JavaScript sigue en el proyecto. Cubre las pantallas. No cubre la memoria, el índice de documentos ni las herramientas.

## Por qué el núcleo va en Python

Ollama habla por HTTP. Esa parte da igual en Python o en JavaScript: los dos pueden enviar un mensaje y leer la respuesta. El lenguaje se elige por lo que rodea al modelo.

1. **Documentos y búsqueda local.** El plan prevé leer PDF y DOCX, partir el texto, calcular embeddings y buscar fragmentos. Esas librerías (PyMuPDF, python-docx, Sentence Transformers, Chroma o Qdrant) están maduras en Python y son las que el plan ya nombra.
2. **Datos que tienen que durar.** SQLAlchemy y Alembic permiten empezar con un archivo SQLite en el ordenador y, en una versión posterior, pasar a PostgreSQL sin reescribir el modelo de datos.
3. **Herramientas con forma fija.** Cada acción del asistente (calcular, leer una carpeta permitida, crear una tarea) debe declarar qué datos acepta y rechazar el resto. Pydantic hace esa validación en el mismo sitio donde vive la herramienta. FastAPI publica además una documentación viva de la API (`/docs`) que la interfaz puede consultar.
4. **Varias pantallas, un solo cerebro.** La web, la app de Mac y la app de Windows tienen que pedir lo mismo al mismo servicio. Si la lógica viviera dentro de la pantalla, habría que copiarla cada vez que aparezca un cliente nuevo.
5. **El equipo ya previsto.** FastAPI, uv, pytest y Ruff cubren API, dependencias, pruebas y formato sin añadir un segundo ecosistema de servidor.

## Qué trabajo hace cada lenguaje

| Trabajo | Lenguaje | Motivo breve |
| --- | --- | --- |
| Conversar con Ollama, guardar chats, indexar documentos, ejecutar herramientas | Python | Librerías de documentos, embeddings y bases de datos |
| Pantallas, formularios, estado visual | TypeScript (React + Vite) | La misma interfaz sirve en el navegador y, después, en el escritorio |
| Ventana nativa, diálogos de archivos, permisos del sistema | Rust, vía Tauri, más adelante | Empaqueta la interfaz sin meter dentro la lógica del asistente |

## Cuándo un backend en JavaScript sería razonable

Tendría sentido si NEXUS fuera solo una ventana de chat que reenvía el texto a un servicio ya alojado en otro sitio, sin leer documentos en local ni programar tareas. En ese caso Node.js evitaría tener dos lenguajes.

Ese no es el producto descrito en los planes. En cuanto aparecen PDF, memoria, colas de trabajo y herramientas con permisos, el camino corto está en el ecosistema Python que el plan ya lista. Mantener el servidor en Node obligaría a buscar equivalentes más flojos o a llamar igualmente a procesos Python por debajo.

Electron sería otra forma de hacer la app de escritorio, también con la interfaz en TypeScript. El plan de escritorio lo deja como alternativa si Tauri no cubre alguna API del sistema. Tampoco mueve el núcleo a JavaScript.

## Consecuencias

- En un ordenador nuevo hay que instalar Python (a través de uv) y Node.js.
- El archivo de dependencias del servidor es `pyproject.toml`, gestionado con uv.
- El archivo de dependencias de la interfaz será `frontend/package.json`.
- No se reescribe el asistente en JavaScript para “tener un solo lenguaje”.
- La decisión se puede revisar si, al llegar a RAG, una prueba pequeña demuestra que el índice vectorial encaja mejor en otro servicio. Eso no cambia el lenguaje del API.
