# Plan de desarrollo de la aplicación de escritorio de NEXUS AI

> Documento complementario al plan general. Define la interfaz y los
> clientes de escritorio para macOS y Windows. Las funcionalidades
> descritas son objetivos de desarrollo, no funcionalidades ya
> implementadas.

## 1. Objetivo

Crear una aplicación instalable de NEXUS AI que permita utilizar el
asistente desde una ventana propia del sistema operativo. La interfaz
será común, en la medida de lo posible, para macOS y Windows. El núcleo
de NEXUS ---backend, orquestador, agentes, memoria, RAG, herramientas e
integraciones--- permanecerá separado de la interfaz.

Objetivos: - Aplicación de escritorio instalable, sin necesidad de
publicarla en App Store o Microsoft Store. - Reutilizar el frontend
entre macOS y Windows. - Permitir ejecución local o conexión a un
servidor NEXUS. - Mantener abierta la posibilidad de añadir web, iPhone
y iPad en el futuro. - Integrar capacidades nativas mediante adaptadores
específicos. - No duplicar la lógica de negocio en el frontend.

Fuera del primer lanzamiento: aplicación móvil completa, Siri avanzada,
sincronización multiusuario compleja, sistema público de plugins y todas
las integraciones posibles. Se reservarán puntos de extensión.

## 2. Stack recomendado

  -----------------------------------------------------------------------
  Capa                    Tecnología              Uso
  ----------------------- ----------------------- -----------------------
  Escritorio              Tauri 2                 Ventanas, empaquetado e
                                                  integración con el SO

  Interfaz                React + TypeScript      Pantallas y componentes

  Desarrollo frontend     Vite                    Servidor y compilación

  Estilos                 CSS modular o Tailwind  Diseño adaptable
                          CSS                     

  Estado remoto           TanStack Query          Caché y sincronización
                                                  con API

  Estado local            Zustand o Context       Estado de interfaz

  Validación              Zod                     Validación de
                                                  formularios y
                                                  respuestas

  Tests                   Vitest + React Testing  Pruebas frontend
                          Library                 

  E2E                     Playwright, si encaja   Flujos completos
                          con la configuración    
                          Tauri                   

  Backend                 Python + FastAPI        API, agentes y
                                                  servicios
  -----------------------------------------------------------------------

**Recomendación inicial: Tauri 2 + React + TypeScript + Vite.** Tauri
genera una aplicación de escritorio que utiliza tecnologías web y
componentes nativos. No empaqueta automáticamente el backend Python: el
arranque y la distribución de ese backend se resolverán por separado.

Electron es una alternativa válida si el equipo necesita su ecosistema
Node, aunque puede consumir más recursos. SwiftUI y WinUI por separado
ofrecen integración nativa profunda, pero duplican más interfaz y
mantenimiento. Antes de adoptar Tauri definitivamente, crear un
prototipo y probarlo en ambos sistemas.

## 3. Arquitectura

``` text
┌──────────────────────────────────────────────────────────┐
│ CLIENTES                                                 │
│ macOS: Tauri + React       Windows: Tauri + React        │
│ (interfaz compartida)      (interfaz compartida)         │
│             Futuro: Web / iOS / iPadOS                   │
└───────────────────────────┬──────────────────────────────┘
                            │ HTTPS o localhost
                            │ REST + SSE/WebSocket
┌───────────────────────────▼──────────────────────────────┐
│ BACKEND NEXUS — Python / FastAPI                         │
│ API · autenticación · permisos · orquestador              │
│ agentes · memoria · RAG · herramientas · integraciones   │
└──────────────┬────────────────────────┬──────────────────┘
               │                        │
        ┌──────▼───────┐         ┌──────▼────────────────┐
        │ Ollama / LLM │         │ SQLite / vector store│
        │ embeddings  │         │ archivos / datos     │
        └──────────────┘         └───────────────────────┘

 Adaptadores nativos por dispositivo:
 macOS: EventKit, App Intents, notificaciones, permisos
 Windows: APIs y mecanismos nativos equivalentes
```

### Responsabilidades

**Frontend:** presenta información, recoge peticiones, gestiona
navegación, ventanas, preferencias y estados. No contiene la lógica
principal de los agentes ni accede directamente a la base de datos.

**Backend:** autentica y autoriza, ejecuta el orquestador y agentes,
gestiona memoria/RAG/herramientas, aplica políticas de seguridad y
registra eventos técnicos.

**Adaptadores nativos:** implementan capacidades específicas del
dispositivo y solicitan permisos del sistema. No duplican la lógica de
negocio.

### Modos de funcionamiento

**Local** - Backend Python y, si el equipo lo soporta, Ollama/modelos se
ejecutan en el propio ordenador. - La app inicia el backend local si
está empaquetado y configurado para ello. - Datos locales en directorios
adecuados del sistema. - Mostrar claramente si el backend, Ollama o un
modelo no están disponibles.

**Conectado a servidor** - La aplicación se conecta a una instancia
remota mediante HTTPS y autenticación. - El servidor gestiona backend,
modelos y datos. - Las capacidades que dependen del dispositivo ---por
ejemplo, Apple Reminders--- deben ejecutarse en el Mac autorizado, no en
un servidor remoto.

**Híbrido futuro** - Combinar capacidades locales y remotas. - Cada
capacidad debe indicar dónde se ejecuta y qué datos transmite. - No
enviar documentos o conversaciones a servicios externos sin conocimiento
y autorización del usuario.

## 4. Estructura de carpetas propuesta

``` text
nexus-ai/
├── backend/
│   └── app/                    # FastAPI, agentes, memoria, RAG...
├── desktop/
│   ├── src/
│   │   ├── app/                # App, rutas y providers
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   ├── chat/
│   │   │   └── feedback/
│   │   ├── features/
│   │   │   ├── onboarding/
│   │   │   ├── chat/
│   │   │   ├── conversations/
│   │   │   ├── agents/
│   │   │   ├── memory/
│   │   │   ├── documents/
│   │   │   ├── calendar/
│   │   │   ├── tasks/
│   │   │   ├── voice/
│   │   │   ├── integrations/
│   │   │   └── settings/
│   │   ├── lib/                # API, auth, platform, validation
│   │   ├── services/
│   │   ├── stores/
│   │   ├── styles/
│   │   └── types/
│   ├── src-tauri/
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   └── platform/
│   │   │       ├── macos/
│   │   │       └── windows/
│   │   ├── capabilities/
│   │   ├── icons/
│   │   └── tauri.conf.json
│   ├── tests/
│   ├── package.json
│   └── vite.config.ts
├── native/
│   └── macos-companion/        # Swift/EventKit si se necesita
├── docs/
│   ├── desktop-architecture.md
│   ├── ui-guidelines.md
│   ├── api-contracts.md
│   └── release-desktop.md
└── README.md
```

La carpeta `native/macos-companion` es una reserva. No es obligatorio
crear una app Swift independiente desde el principio: primero se debe
probar si Tauri y sus plugins cubren la integración requerida.

## 5. Diseño de la interfaz

La interfaz debe sentirse como un asistente personal completo, no solo
como una ventana de chat.

### Navegación principal

``` text
┌──────────────────────────────────────────────────────────┐
│ NEXUS                                      Estado / Perfil│
├──────────────┬───────────────────────────────────────────┤
│ + Nuevo chat │                                           │
│              │  Conversación                              │
│ Conversaciones│ Mensajes, fuentes y acciones              │
│ Agentes      │                                           │
│ Documentos   │                                           │
│ Calendario   │                                           │
│ Tareas       │                                           │
│ Memoria      │                                           │
│ Integraciones│                                           │
│ Ajustes      │  ┌─────────────────────────────────────┐  │
│              │  │ Escribe a NEXUS...           Enviar │  │
└──────────────┴──┴─────────────────────────────────────┴──┘
```

La barra lateral debe poder contraerse y adaptarse a ventanas estrechas.

### Pantallas

  -----------------------------------------------------------------------
  Pantalla                            Responsabilidad
  ----------------------------------- -----------------------------------
  Chat                                Conversar, ver respuestas
                                      progresivas y fuentes

  Conversaciones                      Buscar, abrir, renombrar y archivar

  Agentes                             Consultar agentes,
                                      responsabilidades y estado

  Documentos                          Importar archivos, ver indexación y
                                      colecciones

  Calendario                          Consultar eventos y gestionar
                                      operaciones con confirmación

  Tareas                              Crear, consultar, completar y
                                      organizar

  Memoria                             Consultar y gestionar la
                                      información utilizada como memoria

  Integraciones                       Conectar/desconectar proveedores y
                                      ver permisos

  Ajustes                             Apariencia, conexión, modelo,
                                      privacidad y voz

  Diagnóstico                         Estado del backend, modelo, base de
                                      datos e integraciones
  -----------------------------------------------------------------------

Mostrar solo las funciones que existan. Las futuras deben marcarse como
«En desarrollo» o «Próximamente», sin simular que ya funcionan.

### Chat

-   Mensajes del usuario y de NEXUS.
-   Streaming de respuestas.
-   Indicador de actividad y agente implicado, si el backend lo
    comunica.
-   Referencias a documentos cuando se utilice RAG.
-   Resumen comprensible de herramientas ejecutadas.
-   Detener generación, reintentar, copiar respuesta.
-   Adjuntar documentos cuando esté implementado.
-   Mantener el borrador si falla la conexión.
-   Distinguir respuesta final de acción pendiente de confirmación.

No mostrar prompts internos, secretos ni razonamientos privados del
modelo. Sí se pueden mostrar fuentes, resúmenes de acciones y
resultados.

### Agentes

Mostrar nombre, descripción, capacidades, herramientas autorizadas y
estado (disponible, desactivado, en desarrollo o error). Los permisos
efectivos siempre los decide el backend, nunca la interfaz.

### Documentos y RAG

Permitir seleccionar archivos mediante diálogo nativo, ver formatos y
límites, progreso de importación, estado de indexación, colecciones y
fuentes. Explicar que indexar un documento permite recuperar fragmentos
para responder; no significa que el modelo haya aprendido
permanentemente todo su contenido.

### Calendario y tareas

Mostrar eventos y tareas, filtros y formularios validados. Identificar
el proveedor/cuenta. Pedir confirmación antes de crear, modificar o
borrar elementos. Gestionar permisos denegados, errores de
sincronización y tokens caducados.

### Ajustes

-   General: idioma y preferencias.
-   Apariencia: claro, oscuro o sistema.
-   Conexión: modo local/servidor, dirección y estado.
-   IA: proveedor, modelo y parámetros permitidos.
-   Privacidad: almacenamiento y gestión de datos.
-   Integraciones: cuentas autorizadas.
-   Voz: entrada/salida de audio.
-   Sistema: permisos y diagnóstico.
-   Acerca de: versión, licencias y documentación.

## 6. Sistema visual y accesibilidad

Principios: - Diseño limpio, sobrio y consistente. - Priorizar
legibilidad y rapidez. - Componentes compartidos para botones, campos,
diálogos, menús y notificaciones. - Variables de diseño centralizadas
para color, tipografía, espaciado, radios y estados. - Tema claro,
oscuro y preferencia del sistema. - Navegación por teclado, foco
visible, etiquetas accesibles, contraste suficiente y lectores de
pantalla. - No comunicar estados únicamente mediante color. - Respetar
reducción de movimiento cuando sea posible.

Mantener una guía visual y un catálogo de componentes para evitar
estilos divergentes entre pantallas.

## 7. Comunicación con el backend

La interfaz consumirá una API versionada y documentada. REST para
operaciones habituales y SSE o WebSocket para respuestas progresivas y
eventos en tiempo real. Utilizar OpenAPI y tipos TypeScript validados
(por ejemplo, Zod).

Endpoints conceptuales ---deben adaptarse al backend real; no se
consideran implementados---:

``` text
GET    /api/v1/health
GET    /api/v1/conversations
POST   /api/v1/conversations
GET    /api/v1/conversations/{id}
POST   /api/v1/chat
GET    /api/v1/agents
GET    /api/v1/documents
POST   /api/v1/documents
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/calendar/events
POST   /api/v1/calendar/events
GET    /api/v1/integrations
```

### Streaming

1.  Enviar el mensaje y recibir identificador de petición.
2.  Mostrar estado de procesamiento.
3.  Añadir fragmentos conforme llegan.
4.  Gestionar finalización, cancelación y errores.
5.  Recuperar estado tras una interrupción cuando el backend lo permita.

Definir el formato de eventos antes de implementar el chat completo.
Evitar duplicar operaciones al reintentar.

### Diagnóstico

Mostrar estados comprobados de backend, modelo, base de datos e
integraciones. No indicar «conectado» sin una comprobación real.

## 8. Arranque del backend y Ollama

Este es un punto crítico: Tauri no empaqueta automáticamente una
aplicación Python.

Estrategia: 1. Durante desarrollo, ejecutar FastAPI por separado. 2.
Construir un gestor de ciclo de vida para el modo local. 3. Comprobar si
el backend ya está activo. 4. Iniciar solo el proceso que la app tenga
responsabilidad de iniciar. 5. Esperar a un endpoint de salud antes de
habilitar el chat. 6. Detectar fallos, mostrar diagnóstico y permitir
reintentar. 7. Al salir, cerrar únicamente procesos iniciados por la
aplicación.

El backend local debe escuchar en `127.0.0.1` por defecto, no exponerse
a la red sin una necesidad y protección explícitas.

Para distribuir Python, evaluar PyInstaller, Nuitka o un entorno
gestionado por instalador. Generar y probar artefactos por sistema y
arquitectura: no asumir que un binario sirve para macOS Intel, Apple
Silicon y Windows.

Ollama será un servicio independiente: - Detectar instalación y
disponibilidad. - Consultar modelos existentes. - Permitir seleccionar
modelo compatible. - Pedir consentimiento antes de descargar modelos
grandes. - Mostrar tamaño y requisitos aproximados. - No bloquear la
interfaz durante descargas o carga de modelos. - Permitir modo servidor
sin Ollama local.

Guardar configuración, caché, logs, base de datos y documentos en
directorios adecuados del sistema, nunca en la carpeta de instalación.

## 9. Integraciones nativas

### macOS

Evaluar menú de aplicación, notificaciones, diálogos de archivos,
micrófono, audio, calendario, Recordatorios, Atajos y Siri.

**Apple Calendar y Reminders:** EventKit es una API nativa de Apple. Un
backend Python en Windows o en un servidor no puede acceder directamente
a los datos privados de Recordatorios del Mac. El acceso debe ejecutarse
en el dispositivo Apple autorizado, mediante un componente nativo o
puente local. Empezar probando permisos y lectura; añadir escritura tras
definir autorizaciones y confirmaciones.

### Siri y Atajos

Roadmap: 1. Disponer de API segura y autenticada. 2. Crear un Atajo que
recoja dictado y envíe la petición a NEXUS. 3. Devolver una respuesta
que el Atajo pueda leer. 4. Añadir autenticación y autorización
robustas. 5. Evaluar una app Swift con App Intents para exponer acciones
a Siri y Atajos.

Si NEXUS está en Windows, el Mac/iPhone necesitará conectividad hacia
ese equipo. Para acceso remoto, usar VPN o infraestructura protegida. No
exponer directamente FastAPI de desarrollo a Internet.

### Windows

Evaluar instalador/desinstalador, notificaciones, diálogos de archivos,
bandeja del sistema, inicio automático opcional y permisos de audio.
Mantener la arquitectura común y adaptar detalles a las convenciones de
Windows.

### Contrato de capacidades

Crear una capa para consultar capacidades del dispositivo, por ejemplo:

``` ts
type PlatformCapabilities = {
  notifications: boolean;
  filePicker: boolean;
  microphone: boolean;
  nativeCalendar: boolean;
  nativeReminders: boolean;
  appIntents: boolean;
};
```

La disponibilidad debe comprobarse en ejecución y depender también de
los permisos concedidos. No asumir que una API disponible está
autorizada.

## 10. Seguridad y privacidad

-   Autorización siempre en backend; ocultar un botón no es control de
    seguridad.
-   No incluir claves API ni secretos en frontend, instaladores o
    repositorio.
-   Usar almacenamiento seguro del sistema operativo para tokens cuando
    sea posible.
-   Cifrar datos sensibles según el modelo de amenazas.
-   Validar datos en frontend y backend.
-   Definir permisos Tauri explícitos y mínimos.
-   No construir comandos de shell con texto del usuario.
-   No abrir el backend local a la red por defecto.
-   Usar HTTPS para servidores remotos.
-   Evitar registrar conversaciones, documentos o tokens en logs.
-   Permitir cerrar sesión y revocar integraciones.
-   Informar qué proveedor recibe los datos.

Solicitar confirmación antes de acciones externas o destructivas:
crear/modificar/borrar eventos, enviar mensajes, compartir documentos,
borrar colecciones, cambiar permisos o ejecutar operaciones con costes
relevantes. La confirmación debe estar vinculada a la operación concreta
que el backend ejecutará.

En Tauri: - Configurar capacidades y permisos explícitos. - Desactivar
APIs que no se utilicen. - Validar argumentos de comandos Rust. -
Restringir orígenes y contenido remoto. - No cargar páginas remotas
arbitrarias dentro de una ventana privilegiada. - Revisar dependencias y
actualizaciones.

## 11. Instalación y distribución fuera de las tiendas

No es obligatorio publicar en App Store o Microsoft Store.

### macOS

Artefactos previstos: `.app` y `.dmg`.

Para distribuir a otras personas con una experiencia más fluida: 1.
Compilar para las arquitecturas soportadas. 2. Firmar con certificado
Developer ID. 3. Enviar a notarización de Apple. 4. Comprobar el
resultado. 5. Distribuir el artefacto firmado y notarizado. 6. Probar en
un Mac limpio: instalación, primera apertura, actualización y
desinstalación.

Para pruebas personales se pueden ejecutar compilaciones locales.
Gatekeeper puede advertir o bloquear aplicaciones no
firmadas/notarizadas según el contexto. No convertir la desactivación de
protecciones de macOS en el procedimiento habitual.

### Windows

Generar instalador `.msi` o `.exe` según la configuración. Evaluar firma
de código para mejorar confianza y reducir advertencias. Probar
instalación, permisos, antivirus, actualización y desinstalación.

### GitHub Releases

Publicar versiones con: - Versionado semántico. - Notas de cambios. -
Artefactos por sistema y arquitectura. - Hashes SHA-256. - Instrucciones
de instalación y problemas conocidos. - Documentación y política de
seguridad.

Nunca subir `.env`, tokens OAuth, claves, bases de datos reales,
conversaciones, documentos privados de RAG o logs sensibles.

### Actualizaciones

Diseñar actualización segura: - Consultar versiones desde una fuente
oficial. - Verificar integridad y firma. - Informar y permitir
posponer. - Migrar datos de forma controlada y con copia de seguridad
cuando corresponda. - No ejecutar actualizaciones desde ubicaciones
arbitrarias.

Implementar actualización automática solo después de disponer de un
proceso de releases y firma fiable.

## 12. Fases de implementación

Cada fase termina con una funcionalidad demostrable, pruebas y
documentación.

### UI-0 --- Prototipo técnico

-   Crear proyecto Tauri 2 + React + TypeScript + Vite.
-   Ejecutarlo en macOS y Windows.
-   Probar ventana, navegación, diálogos e icono.
-   Conectarlo a un FastAPI mínimo.
-   Generar un artefacto instalable de prueba por sistema.
-   Fijar versiones de herramientas.

**Aceptación:** abre en ambos sistemas, consulta el endpoint de salud y
genera instaladores de prueba.

### UI-1 --- Sistema visual

-   Estructura de carpetas y rutas.
-   Layout principal y navegación.
-   Componentes comunes y temas.
-   Estados de carga, error, vacío y éxito.
-   Accesibilidad básica y guía visual.

**Aceptación:** navegación funcional, temas correctos y componentes
probados.

### UI-2 --- API y chat

-   Contratos API documentados.
-   Cliente HTTP y autenticación.
-   Diagnóstico de conexión.
-   Conversaciones y envío de mensajes.
-   Streaming, cancelación, reintentos y errores.
-   Referencias y conservación de borradores.

**Aceptación:** chat real con streaming y errores recuperables, sin
secretos en cliente.

### UI-3 --- Configuración y modo local

-   Asistente inicial.
-   Elección de modo local o servidor.
-   Configuración de URL.
-   Gestor de arranque y parada del backend empaquetado.
-   Detección de Ollama y modelos.
-   Diagnóstico de dependencias.

**Aceptación:** configuración sin editar código y detección fiable de
servicios.

### UI-4 --- Agentes, tareas y RAG

-   Pantalla de agentes y estados reales.
-   Gestión de tareas.
-   Importación de documentos.
-   Progreso de indexación.
-   Fuentes y citas.
-   Aislamiento de datos por usuario.

**Aceptación:** la interfaz refleja el backend real y no mezcla datos de
usuarios.

### UI-5 --- Calendario e integraciones

-   Pantalla de integraciones.
-   OAuth de Google coordinado con backend.
-   Consulta de calendarios/eventos.
-   Escritura con confirmación.
-   Prototipo EventKit en macOS.
-   Gestión de permisos y tokens caducados.

**Aceptación:** lectura y operaciones autorizadas; integración Apple
ejecutada en el Mac autorizado.

### UI-6 --- Voz, Atajos y funciones nativas

-   Entrada y salida de voz.
-   Permisos de micrófono.
-   Atajo de Apple para dictado y respuesta hablada.
-   Evaluar App Intents.
-   Notificaciones nativas y acciones de bandeja/barra si aportan valor.

**Aceptación:** voz controlable, permisos claros y conexión autenticada.

### UI-7 --- Calidad y lanzamiento

-   Pruebas unitarias, integración y E2E.
-   Pruebas en equipos limpios.
-   Iconos, metadatos y licencias.
-   Empaquetado de backend y dependencias.
-   Instaladores macOS/Windows.
-   Firma y notarización macOS para distribución.
-   Releases y documentación de instalación/actualización.

**Aceptación:** instalación, actualización y desinstalación probadas;
artefactos trazables al código publicado.

## 13. Pruebas y CI

Frontend: - Componentes, formularios, navegación y accesibilidad. -
Estados de carga/error/vacío. - Streaming y cancelación.

Integración: - API, autenticación, expiración de sesión. -
Desconexión/reconexión. - Subida/eliminación de documentos. -
Confirmaciones de operaciones externas.

Por sistema: - macOS: Apple Silicon y, si se soporta, Intel; permisos,
Gatekeeper, firma, notarización y EventKit. - Windows: versiones
declaradas, permisos, antivirus/firewall, instalación y cierre de
procesos.

GitHub Actions: - Lint y comprobación de tipos. - Tests frontend y
backend. - Build de interfaz. - Builds de escritorio cuando los runners
y secretos estén configurados.

Certificados y credenciales de publicación deben almacenarse como
secretos protegidos del CI, nunca en Git.

## 14. Rendimiento y robustez

-   La ventana no debe esperar a que cargue un modelo grande.
-   El estado del backend debe ser independiente del renderizado.
-   Ejecutar tareas largas en segundo plano.
-   Mostrar progreso de descargas e indexación.
-   Gestionar timeouts y desconexiones.
-   Evitar operaciones duplicadas al reintentar.
-   Medir CPU y memoria en equipos modestos.
-   Probar con distintos tamaños de modelo. La velocidad de inferencia
    depende del modelo y del hardware, no solo de la interfaz.

## 15. Documentación del repositorio

Mantener:

``` text
docs/
├── desktop-architecture.md
├── desktop-development.md
├── ui-guidelines.md
├── api-contracts.md
├── native-integrations.md
├── packaging-macos.md
├── packaging-windows.md
└── release-desktop.md
```

El README explicará plataformas realmente soportadas, ejecución de
desarrollo, conexión al backend, generación de instaladores, estado real
de funciones y reporte de errores. Usar capturas limpias con datos
sintéticos.

## 16. Riesgos y decisiones pendientes

  -----------------------------------------------------------------------
  Decisión o riesgo                   Tratamiento
  ----------------------------------- -----------------------------------
  Tauri no cubre alguna API nativa    Prototipar; añadir adaptador nativo
                                      solo si hace falta

  Empaquetar Python es complejo       Separar backend durante desarrollo
                                      y validar empaquetado por SO

  Modelo local demasiado grande       Detectar requisitos y ofrecer
                                      alternativas

  APIs distintas entre sistemas       Contratos comunes y adaptadores

  Apple Reminders desde servidor      Ejecutar en el Mac autorizado

  Tokens y datos sensibles            Almacenamiento seguro y
                                      autorización backend

  Cambios de API                      Versionado, OpenAPI y pruebas de
                                      contrato

  Firma/notarización                  Preparar proceso de release antes
                                      de distribución

  Multiusuario                        No confiar en IDs del frontend;
                                      autorizar en backend

  Funciones no implementadas          Mostrar estado real
  -----------------------------------------------------------------------

Antes de la versión estable decidir: 1. Si el primer objetivo es macOS y
Windows simultáneamente o se prioriza uno. 2. Si el modo local es
obligatorio desde el primer lanzamiento. 3. Si el backend se incluye en
el instalador o se instala aparte. 4. Qué versiones y arquitecturas se
soportan. 5. Qué funciones Apple requieren un componente Swift. 6. Si la
primera release pública tendrá firma y notarización.

## 17. Orden recomendado

1.  Prototipo Tauri en macOS y Windows.
2.  Conexión a FastAPI mínimo.
3.  Layout y sistema visual.
4.  Chat real con streaming.
5.  Configuración local/remota.
6.  Arranque controlado del backend.
7.  Agentes, documentos, RAG y tareas.
8.  Google Calendar y después EventKit.
9.  Voz, Atajos y App Intents.
10. Firma, notarización, instaladores y releases.

**Regla de arquitectura:** el frontend es un cliente de NEXUS, no el
lugar donde reside su inteligencia. Orquestación, agentes, memoria, RAG,
permisos y operaciones pertenecen al backend o a adaptadores nativos
explícitos. Así se podrá añadir una interfaz web o móvil sin duplicar el
cerebro del asistente.

## 18. Documentación oficial

Consultar las versiones vigentes antes de implementar y publicar:

-   Tauri: https://tauri.app/
-   Tauri v2: https://v2.tauri.app/
-   Tauri distribución: https://v2.tauri.app/distribute/
-   React: https://react.dev/
-   TypeScript: https://www.typescriptlang.org/docs/
-   Vite: https://vite.dev/guide/
-   FastAPI: https://fastapi.tiangolo.com/
-   Apple distribución macOS:
    https://developer.apple.com/macos/distribution/
-   Apple notarización:
    https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution
-   Apple EventKit: https://developer.apple.com/documentation/eventkit
-   Apple App Intents:
    https://developer.apple.com/documentation/appintents
-   Microsoft firma de código:
    https://learn.microsoft.com/windows-hardware/drivers/dashboard/code-signing-reqs
