# Planes terminados

Resumen de los planes de `docs/pending/` que ya se terminaron: qué se hizo, las decisiones que siguen vigentes, lo que
hay que cuidar y los commits clave. El texto completo de cada plan queda en el historial de git.

---

## Mejoras de estilos y pantallas (2026-11-09 → 2026-11-11)

Plan original: `docs/pending/mejoras-estilos-pantallas-pulse-2026-11-09.md` (borrado en el commit que agrega este
resumen). Comparaba `src/` con el patrón de diseño del `CLAUDE.md` y `THEME_GUIDE.md`. Se trabajó en `develop`.

### Qué se hizo
- **Componentes base con tokens (E1, E2, E3):** clases que no existían (el overlay de carga salía transparente),
  `Modal` y `skeleton-table` con colores del tema, y `globals.css` sin colores fijos (`.input-label`, `.status-*`,
  `.button-href`, `.button-options-sales`, `.input-radio` y los `.button-grey/lime/cyan/green/red`).
- **Componentes nuevos:**
  - `Badge` (C1) para estados, etiquetas y contadores.
  - `Spinner` (C2) como único indicador de carga; se borró `Loader` y la dependencia `react-loader-spinner`.
  - Hook `useModalBehavior` (C3) en `Modal` y `DeleteModal`: Escape, bloqueo del scroll y foco.
  - Tamaños `text-xxs`/`2xs`/`3xs` (C4) en `tailwind.config.ts` en lugar de `text-[Npx]`.
  - Clase `.input-sm` (P5) para inputs dentro de tablas.
- **Pantallas:**
  - "Actualizar precios" de Productos dentro de `LinksList`, con confirmación (P1).
  - Detalle del corte y de caja con la tarjeta del patrón (P2).
  - Scroll horizontal en 4 tablas (P4).
  - Se borraron las páginas de ejemplo `protected` y `protected-ssr` (P6).
- **Colores fijos (E4):** todos pasaron a tokens del tema, salvo las excepciones de abajo.
- **`clickeable-table` (A2):** en filas de listas y buscadores, labels "(Click para agregar)" y los botones de acción
  de la venta.

### Decisiones vigentes
- **Colores:** siempre tokens del tema. Excepciones: las paletas de categorías (`PercentSalesType`,
  `ContactKpiCards`, `redirects/info`), las ilustraciones SVG (`AutomationFlowIllustration`, `styles/svg.tsx`) y el
  buscador por código de la venta (`OrderProductsSearchByCode`). Sin aviso de colores en el lint.
- **`.clickeable` (75 %):** para botones pequeños, íconos y tarjetas (mesas, delivery, clientes, imágenes).
  **`.clickeable-table` (95 %):** para filas, labels a lo ancho y los botones de acción de la venta.
- **Modales:** Escape sigue la regla de `closeOnOverlayClick` (si el fondo no cierra, Escape tampoco). `DeleteModal`
  va en `z-50`, enfoca "No, Cancelar" y no se cierra mientras `isSending`.
- **Spinner de borrar** en las tablas: `primary`, no rojo.
- **Diferencia de efectivo** (corte y caja): sobrante en `info`, faltante en `danger`, cero en el color normal.
- **Tema:** lo define el sistema (1/2 → `navy`, el resto → `green`). El selector del Drawer sigue comentado a
  propósito (P7, sin cambios).
- **Descartados por el usuario:**
  - P3: `ViewTitle` en `dashboard` y `help`.
  - P7: selector de tema.
  - A1: pasar `div`/íconos con `onClick` a `<button>`.
  - A3: ampliar `Button` y migrar los botones nativos.
  - Labels de P5: `aria-label` y labels en 23 campos sin `<label>`.
  - L5 de la auditoría (default de `closeOnOverlayClick`) quedó para la auditoría.

### Cosas que cuidar
- **Clases de `globals.css`:** no están en `@layer`, así que se generan después de las utilidades y les ganan. Para
  cambiar algo que ya define una de esas clases hay que usar `!`: `input !pl-10`, `input-sm !border-danger`,
  `!bg-danger/20` en filas con zebra.
- **Checkboxes nativos:** se colorean con `accent-*`, no con `bg-*`.
- **Opacidad:** solo funciona con los valores de la escala de Tailwind (`/10`, `/15`, `/20`…); `/8` no se genera.
- **Escape propio dentro de un modal:** un componente que use Escape para lo suyo (cerrar un desplegable, cancelar una
  edición) llama `e.stopPropagation()` para no cerrar el modal.
- **Colores de `.button-*`:** no se pasaron a `Button`. Si algún día se retoma A3, antes hay que ampliar `Button` con
  `icon`, un `size` `sm` y `disabled` como `<button disabled>`; hoy renderiza un `<div>`.

### Commits clave (pulse, `develop`)
`11ab7e3` (E1–E3, A2, C1–C4), `5e5b926` (P1, P2, P4, P6), `b9b3aa2` (P5 y P7), `8602e2a` (colores de `.button-*`),
`aaf170c` (E4 en la venta), `130d0fa` (`clickeable-table` en los botones de venta), `09a1e18` (E4 en el resto).
