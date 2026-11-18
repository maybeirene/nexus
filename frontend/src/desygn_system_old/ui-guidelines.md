# Guía visual de NEXUS

Sistema de diseño simple: **un acento, tres radios, tema oscuro por defecto.**
Todo el estilo vive en `desktop/src/styles/`.

## Archivos

| Archivo | Contenido |
|---|---|
| `tokens.css` | Colores, tipografía, espaciado, radios, movimiento y layout |
| `base.css` | Reset, tipografía, foco visible, movimiento reducido |
| `components.css` | Botones, campos, tarjetas, badges, avisos, layout, chat, diálogo |
| `index.css` | Importa los tres anteriores. Se importa una vez en `main.tsx` |
| `showcase.html` | Catálogo visual. Ábrelo en el navegador para ver todos los componentes |

## Reglas

1. **Los componentes solo usan variables** (`var(--surface)`), nunca colores sueltos. Cambiar la apariencia = cambiar `tokens.css`.
2. **Un solo acento** (`--accent`). Se usa en la acción principal, el elemento activo y el foco. Nada más.
3. **Tres radios:** `--radius-sm` (6px) para detalles internos, `--radius-md` (10px) para botones, campos y tarjetas, `--radius-full` para badges e interruptores.
4. **Sin sombras** salvo en diálogos. La jerarquía se marca con superficie y borde: `--bg` < `--surface` < `--surface-2`.
5. **Espaciado** solo con la escala `--space-1` a `--space-7` (múltiplos de 4px).
6. **El estado nunca depende solo del color.** Los badges y avisos llevan siempre texto ("Disponible", "Error", "Próximamente").
7. **Texto de interfaz** en español, en minúscula tras la primera letra, con verbos claros: "Guardar cambios", no "Enviar". El mismo nombre en botón y confirmación.
8. **Errores:** di qué ha pasado y cómo solucionarlo. Sin disculpas ni mensajes vagos.
9. **Funciones futuras:** `badge` "Próximamente" en el elemento de navegación. No simular que funcionan.

## Paleta

| Token | Oscuro | Claro | Uso |
|---|---|---|---|
| `--bg` | `#0f1218` | `#f6f7f9` | Fondo de la app |
| `--surface` | `#151a22` | `#ffffff` | Sidebar, tarjetas, diálogos |
| `--surface-2` | `#1c222c` | `#eef0f4` | Campos, botones, hover |
| `--border` | `#2a313d` | `#d9dde5` | Bordes |
| `--text` | `#e6e9ef` | `#151a22` | Texto principal |
| `--text-muted` | `#98a1b0` | `#556070` | Texto secundario |
| `--accent` | `#8b9cff` | `#4a5be0` | Acción principal, activo, foco |
| `--success` / `--warning` / `--danger` | `#5fd3a0` / `#e8b95a` / `#f27d7d` | `#1f7a54` / `#8a6200` / `#c0392b` | Estados |

## Tipografía

Fuentes del sistema (`Inter` si está instalada), así la app funciona sin conexión y se siente nativa en macOS y Windows. Escala: 12 / 13 / **14 (base)** / 16 / 20 / 24 px.

## Uso en React

```tsx
// main.tsx
import "./styles/index.css";
import { initTheme } from "./lib/theme";

initTheme(); // antes de renderizar
```

```tsx
<button className="btn btn--primary">Enviar</button>
<span className="badge badge--success">Disponible</span>
<div className="alert alert--danger" role="alert">
  <p className="alert__title">No se pudo conectar con el backend</p>
  <p className="alert__text">Comprueba que NEXUS está en marcha y reintenta.</p>
</div>
```

Cambiar de tema: `setThemePreference("dark" | "light" | "system")`.

## Cómo añadir un componente nuevo

1. Reutiliza antes que crear: ¿lo resuelve `card`, `badge` o `alert`?
2. Si no, añádelo a `components.css` con prefijo propio (`.nombre`, `.nombre__parte`, `.nombre--variante`).
3. Usa solo tokens. Si falta un valor, se añade a `tokens.css`, no al componente.
4. Comprueba foco con teclado, estado desactivado y ambos temas en `showcase.html`.
