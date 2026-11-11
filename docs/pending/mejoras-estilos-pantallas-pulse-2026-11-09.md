# Mejoras de estilos y pantallas en pulse

Fecha: 2026-11-09 · Rama revisada: `developer` (`2d9d582`)
Estado: en curso en `feature/mejoras-estilos`. Hecho: E1, E2, E3 (salvo los `.button-*` de color, ver E3), A2, C1, C2,
C3 (sin L5) y C4.

Comparación de `src/` contra el patrón de diseño de `CLAUDE.md` (sección "Sistema de Temas y Estilos") y
`THEME_GUIDE.md`. El patrón: colores solo con tokens del tema (`bg-bg-content`, `text-text-base`, `text-primary`,
`text-danger`...), tarjetas `bg-bg-content rounded-lg shadow-sm border border-bg-subtle`, tablas con el header
`bg-bg-subtle/60` y zebra, `Modal` compuesto, `Button` con presets, `ViewTitle`, `NothingHere` y skeletons.

En general se sigue bien: de 108 archivos con tablas, 101 tienen la zebra y todos menos `skeleton-table` tienen el
header del patrón; 78 páginas usan la maquetación
7/3, 83 de 99 páginas usan `ViewTitle`, y hay `NothingHere` y skeletons en unas 100 pantallas cada uno. Lo que sigue
son las excepciones.

## Resumen

| # | ID | Qué | Alcance | Esfuerzo |
|---|----|-----|---------|----------|
| 1 | E1 | Clases que no existen (overlay de carga transparente) | 5 archivos | bajo |
| 2 | E2 | `Modal` y `skeleton-table` con colores fijos | 2 archivos base | bajo |
| 3 | E3 | Clases de `globals.css` con colores fijos (`.button-*`, `.status-*`, `.input-label`) | 1 archivo, afecta a todo | bajo |
| 4 | E4 | Colores de Tailwind fijos en componentes | 304 usos en 71 archivos | medio |
| 5 | C1 | Componente `StatusBadge` (26 pastillas armadas a mano) | 20 archivos | bajo |
| 6 | C2 | Un solo spinner | 90 usos, 6 variantes | bajo |
| 7 | C3 | `DeleteModal` y `Modal`: z-index, Escape, foco y scroll | 2 archivos | bajo |
| 8 | P1-P6 | Ajustes por pantalla | ver abajo | bajo/medio |
| 9 | A1-A3 | Accesibilidad: clics en `div` e íconos, labels | ~110 puntos | medio |

---

## 1. Errores de estilo (se ven mal hoy)

### E1 · Clases que no existen en el tema
Tailwind las ignora, así que el elemento queda sin color:

| Archivo | Clase | Efecto | Cambiar por |
|---|---|---|---|
| `src/components/LoadingPage.tsx:23,25` | `bg-background-main`, `text-text-main` | el overlay de carga de todos los layouts queda **transparente** y el texto en el color heredado | `bg-bg-base/75`, `text-text-base` |
| `src/components/Loader.tsx:10` | `bg-background-main` | igual | `bg-bg-base/75` |
| `src/components/button/LiComponent.tsx:15` | `text-text-subtle` | la flecha de `LinksList` sale en el color del texto | `text-text-muted` |
| `src/components/products/add/AddDetailsModal.tsx:77`, `RegistersProductsTable.tsx:75` | `text-subtle` | "Total ingresado" sin color | `text-text-muted` |
| `src/components/orders/restaurant/RestaurantProductsAdded.tsx:87` | `text-grey-800` | ícono de quitar producto en negro por defecto | `text-text-muted hover:text-danger` |

### E2 · Los componentes base tienen colores fijos
- `src/components/modal/Modal.tsx:55` `bg-white`, `:73` `border-gray-200`, `:74` `text-gray-900`, `:80` botón de cerrar
  `text-gray-400 hover:bg-gray-200`, `:96` `border-gray-200`. Como lo usan los 98 modales, el tema verde (con
  `bg-subtle` verde) muestra modales grises.
  → `bg-bg-content`, `border-bg-subtle`, `text-text-base`, `text-text-muted hover:bg-bg-subtle`.
- `src/components/skeleton/skeleton-table.tsx:12-28`: `text-gray-500`, `bg-gray-50`, `bg-gray-300`, `bg-gray-200`.
  Es el único `<thead>` fuera del patrón. → `bg-bg-subtle/60` y barras `bg-bg-subtle`, como los otros skeletons.

### E3 · `globals.css` con colores fijos
`src/styles/globals.css:148-196`

- `.input-label` usa `text-gray-700` (todos los formularios) → `text-text-base`.
- `.status-success/danger/info/warning` usan `lime-500`, `red-500`, `sky-500`, `orange-400` → `text-success`,
  `text-danger`, `text-info`, `text-warning`.
- `.button-href` (`bg-sky-600`), `.button-grey/lime/cyan/green/red/green-dark/disabled` y `.button-options-sales`
  (`text-slate-700 hover:bg-slate-100`) no siguen el tema. Se usan poco (18 usos de `button-*` y 35 de
  `button-options-sales`).
  → `.button-href` con `bg-primary hover:bg-primary/90`. Las demás: pasar sus usos a `Button` con preset (ver E4) y
  borrar las que queden sin uso. `.button-options-sales` → `text-text-base hover:bg-bg-subtle`.
- `.input-radio` tiene `dark:` y `#3b71ca` fijo (heredado de TW Elements); la app no tiene modo oscuro. Simplificar con
  `border-bg-subtle checked:border-primary checked:after:bg-primary`.

**Hecho (2026-11-11):** `.input-label`, `.status-*`, `.button-href`, `.button-options-sales` e `.input-radio` usan
tokens; se borraron `.button-green-dark` y `.button-disabled` (sin uso). **Pendiente:** `.button-grey/lime/cyan/green/red`
siguen con colores fijos. Se usan en los botones de acción de venta (`OrderButtons`, `RestaurantButtons`, `PayButton`,
`SaveButton`, `PrintOrderButton`), en `ChatbotThread` y en 4 páginas con `button-green`; pasarlos a `Button` con preset
junto con A3, revisando cómo queda la pantalla de venta.

---

## 2. Colores fijos en componentes (E4)

304 usos de colores de Tailwind (`gray-*`, `red-*`, `blue-*`...) en 71 archivos. Los que más tienen:

| Archivo | Usos | Nota |
|---|---|---|
| `src/components/cuts/CutDetailsModal.tsx` | 34 | detalle del corte: `text-gray-*`, `bg-gray-50` y pastillas `bg-red-100 text-red-800` |
| `src/app/redirects/info/page.tsx` | 26 | pantalla de aviso (puede tener paleta propia, pero debería usar `warning`/`info`) |
| `src/components/reports/AutomationFlowIllustration.tsx` | 14 | ilustración: se puede dejar |
| `src/components/cashdrawer/CashDrawerDetails.tsx` | 10 | detalle de caja |
| `src/components/contacs/details/ContactKpiCards.tsx` | 9 | KPIs del contacto |
| `src/app/annexes/purchases/page.tsx` | 8 | |
| `src/components/orders/restaurant/RestaurantProductsAdded.tsx` | 6 | pantalla de venta |
| `src/components/contacs/ContactAddSV.tsx`, `ContactAddHN.tsx`, `ContactAddGT.tsx` | 6 / 4 / 4 | formularios de contacto por país |
| `src/components/orders/restaurant/PercentSalesType.tsx` | 5 | |
| `src/components/invoicing/InvoiceDetailsButtons.tsx` | 5 | |
| `src/components/restaurant/OrderDetailsModal.tsx`, `products/remove/ChangeLotModal.tsx`, `orders/restaurant/ProductOptionsEditModal.tsx` | 4 c/u | |

Equivalencias para el reemplazo:

| Fijo | Token |
|---|---|
| `text-gray-900/800/700` | `text-text-base` |
| `text-gray-600/500/400` | `text-text-muted` |
| `bg-gray-50/100`, `border-gray-200/300` | `bg-bg-subtle/40`, `border-bg-subtle` |
| `bg-white` | `bg-bg-content` |
| `text-red-*`, `bg-red-100` | `text-danger`, `bg-danger/10` |
| `text-green-*`, `bg-green-100` | `text-success`, `bg-success/10` |
| `text-blue-*`, `bg-blue-100` | `text-info` o `text-primary`, `bg-info/10` |
| `text-yellow/amber/orange-*` | `text-warning`, `bg-warning/10` |

Sugerencia: hacerlo por módulo (cortes y caja primero, que es lo que más ve el cajero) y agregar una regla de lint
o un `grep` en el pre-commit que avise de nuevos `-(gray|red|blue|green)-[0-9]`.

---

## 3. Componentes que faltan o se repiten

### C1 · `StatusBadge`
Hay 26 pastillas de estado armadas a mano en 20 archivos (`rounded-full px-2 py-1 bg-red-100 text-red-800`,
`bg-success/10 text-success`...), con colores y tamaños distintos para el mismo concepto ("Abierto", "Cerrado",
"Anulado", "Pendiente"). `maintenance/MaintenanceStatusBadge.tsx` ya resuelve esto para mantenimientos.
→ Un `src/components/StatusBadge.tsx` genérico (`variant: success | danger | warning | info | muted`, con
`bg-{variant}/10 text-{variant}`) y usarlo en cortes, cajas, documentos, transferencias, créditos y órdenes.

**Hecho (2026-11-11):** se llamó `Badge` (`src/components/Badge.tsx`) porque cubre estados, etiquetas y contadores
(decisión del usuario). `variant`: `primary`/`success`/`danger`/`warning`/`info`/`accent`/`muted`; `size`: `md`
(`text-xs`, por defecto) y `sm` (10px en mayúsculas), las dos que eligió el usuario. Se reemplazaron 24 pastillas en
19 archivos, entre ellas las de estado del corte (`CutDetailsModal`, antes con `bg-red-100`...), "Exento" del
contacto (antes `amber` fijo, ahora `warning`), "IA" y urgentes del dashboard, la variación % de `WidgetSeries`, el
ajuste de inventario y las de compras. Fuera quedan los avisos en caja (`div p-3 bg-warning/10`), los botones con
fondo tenue, los chips con botón de quitar (`FieldOptionsTagsInput`) y los chips con ícono de
`AddProductForm`/`RemoveProductsForm`. `Indicator` (punto + texto) se mantiene para columnas de tablas.

### C2 · Un solo spinner
Hay seis variantes: `FaSpinner` (27), `LuLoader` (25), `LuLoaderCircle` (18), `AiOutlineLoading` (11),
`ImSpinner5` (8) y `react-loader-spinner` (`Loader.tsx`, una dependencia solo para eso).
→ Un `<Spinner size />` con `LuLoaderCircle animate-spin text-primary`, y quitar `react-loader-spinner` del
`package.json` si `Loader.tsx` pasa a usarlo.

**Hecho (2026-11-11):** `src/components/Spinner.tsx` (`size`, `color`: `primary`/`muted`/`info`/`danger`/`inverted`/
`current`, `className`). Se reemplazaron los usos con `animate-spin` de las 5 variantes de `react-icons`, incluidos los
presets de `Button` (`color="current"`). Decisiones del usuario: el spinner de borrar en las tablas de caja y de
ingreso/descargo pasa del rojo fijo a `primary`; `Loader.tsx` se borró (sus 5 usos usan `Spinner`) y se quitó
`react-loader-spinner` (con `styled-components` y `@emotion/*`, que solo traía esa dependencia). En
`annexes/downloads` quedan `FaSpinner` (ícono fijo del estado "Procesando") y `LuLoader` sin giro: no son indicadores
de carga.

### C3 · `Modal` y `DeleteModal`
- `DeleteModal` (`src/components/DeleteModal.tsx:18,25`) usa `z-10`: el Navbar (`sticky z-50`) queda por encima del
  fondo oscuro y se puede usar con el modal abierto. Pasarlo a `z-50` o, mejor, armarlo sobre `Modal`
  (`size="sm"` + ícono + `Button` presets) para que haya un solo tipo de modal.
- `Modal` no cierra con Escape, no lleva `role="dialog"`/`aria-modal`, no mueve el foco al abrir y no bloquea el
  scroll del fondo. Agregar las cuatro cosas en el componente base.
- Ver L5 de la auditoría: el default `closeOnOverlayClick = true` hace perder formularios.

**Hecho (2026-11-11):** hook `src/hooks/useModalBehavior.ts`, usado por `Modal` y `DeleteModal`: Escape cierra solo el
modal de arriba y sigue `closeOnOverlayClick` (decisión del usuario), bloqueo del scroll, foco al abrir y devolución al
cerrar. `Modal` lleva `role="dialog"`, `aria-modal` y `aria-label`. `DeleteModal` pasa a `z-50`, enfoca "No, Cancelar"
y no se cierra con Escape mientras `isSending`. Los 4 componentes con su propio Escape (`CatalogSearchSelect`,
`EconomicActivitySelect`, `ManageCategories`, `ManageOptions`) llaman `stopPropagation`. L5 queda para la auditoría
(decisión del usuario); `DeleteModal` no se rehízo sobre `Modal`.

### C4 · Tamaños de letra arbitrarios
119 usos de `text-[Npx]` (`text-[11px]`, `text-[12px]`, `text-[13px]`...). La mayoría equivalen a `text-xs` (12 px)
o `text-sm` (14 px). Dejar `text-[11px]` solo donde haga falta (pantallas densas como la de despacho) y unificar el
resto.

**Corrección y hecho (2026-11-11):** la mayoría no equivalía a `text-xs`: eran 63 `[10px]`, 40 `[11px]`, 12 `[9px]`,
3 `[12px]` y 1 `[13px]`. Por decisión del usuario se agregaron a `tailwind.config.ts` `text-xxs` (11px), `text-2xs`
(10px) y `text-3xs` (9px), que solo fijan el `font-size` y se ven igual, y se reemplazaron todos los usos (también en
`.button-options-sales`). `[12px]` pasó a `text-xs` y el `[13px]` del nombre de la mesa (`TableCard`) también a
`text-xs`. Quedan `text-[7rem]`/`[9rem]` de las páginas de error.

---

## 4. Pantallas

### P1 · Productos (`src/app/products/page.tsx:56-68`)
El bloque "ACTUALIZAR PRECIOS" es un `<div onClick>` con `<li>` sueltos fuera de un `<ul>`, `hover:bg-blue-200
hover:text-blue-800` y un SVG pegado a mano. Es el único de la columna que no usa `LiComponent`.
→ Meterlo en el `LinksList` con `LiComponent` (`onClick`) y un spinner, y pedir confirmación (es una sincronización
que borra y recrea precios desde la casa matriz).

### P2 · Detalle del corte (`src/components/cuts/CutDetailsModal.tsx`)
La pantalla con más colores fijos (34). Tarjetas `bg-gray-50` que no son las tarjetas del patrón y pastillas a mano.
→ Tarjetas del patrón, `StatusBadge` y `text-danger`/`text-success` para la diferencia de efectivo. Lo mismo en
`CashDrawerDetails.tsx`.

### P3 · Pantallas sin `ViewTitle`
`dashboard`, `orders/products`, `orders/restaurant`, `orders/restaurant/split`, `restaurant/screen` y `help` no lo
usan. En las de venta y pantalla de cocina tiene sentido (se aprovecha el alto), pero `dashboard` y `help` deberían
tenerlo para ser iguales al resto. Las de `redirects/*`, login y `pedido/[token]` son pantallas aparte y están bien.

### P4 · Tablas sin scroll horizontal en móvil
`src/components/dashboard/widgets/WidgetList.tsx`, `orders/products/ShowOrders.tsx`,
`products/new/ProductsLinkedModal.tsx` y `products/ProductAvailabilityModal.tsx` no tienen el contenedor
`overflow-x-auto`: en celular se salen del ancho. Envolverlas como las otras 104 tablas.

### P5 · Inputs y selects fuera del patrón
16 `<input>` (sin contar checkbox, radio y file) y 9 de 66 `<select>` no usan `.input` / `.input-select`, y 21 archivos
con inputs no tienen `<label>` ni `.input-label`. Revisar con:
`grep -rnE '<input[^>]*className="[^"]*"' src | grep -v 'input'`.

### P6 · Páginas de ejemplo
`src/app/protected` y `src/app/protected-ssr` tienen textos en inglés ("Protected Page", "Loading...") y son las de
ejemplo de NextAuth: borrarlas (también están en el `matcher` del middleware). En `PayModal.tsx:63` hay un label
`sr-only` "Search" con `dark:text-white`: pasarlo a "Buscar" sin `dark:`.

### P7 · Selector de tema del Drawer
`Drawer.tsx:266` muestra los cuatro temas, pero `useConfigLogic` vuelve a poner `navy` o `green` según el sistema cada
vez que se recarga la configuración (R4 de la auditoría). Decidir si se quita el selector o se respeta la elección
del usuario. El `CLAUDE.md` y `THEME_GUIDE.md` describen el selector como funcional.

---

## 5. Accesibilidad e interacción

### A1 · Clics en elementos que no son botones
77 `<div>`, `<span>` o `<li>` con `onClick` y 35 íconos (`<FaX onClick>`, `<BiX onClick>`...) que no se pueden usar con
teclado ni los anuncia un lector de pantalla. Ejemplos: el menú "Opciones" de venta (`orders/products/Buttons.tsx:46-49`,
`button-options-sales`), la lupa del Navbar (`Navbar.tsx`, `BiSearch onClick`), quitar productos en restaurante
(`RestaurantProductsAdded.tsx:87`).
→ Usar `<button type="button">` (o `Button` con preset `small*`) y `aria-label` en los de solo ícono.

### A2 · `.clickeable` reduce el elemento al 75 %
`src/styles/globals.css:128` (`active:scale-75`) se aplica a botones grandes (p. ej. "Opciones" en venta) y el salto se
nota mucho. `.clickeable-table` usa `scale-95`. Bajar `.clickeable` a `active:scale-95`.

**Hecho (2026-11-11), distinto a lo propuesto:** el usuario decidió conservar `.clickeable` (75 %) en botones, íconos y
tarjetas (incluidas mesas, delivery, imágenes de opciones y avatares de clientes, y los botones de venta). Se pasaron a
`.clickeable-table` solo las filas de listas y buscadores (búsqueda de productos, `LinksList`/`LiComponent`,
sucursales, conversaciones del chatbot, historial, roles, categorías, filas de la pantalla de cocina, opciones del
pedido público, `SelectBranch`, descargas) y los 10 labels "(Click para agregar)". Los ítems de `.button-options-sales`,
el resumen de venta cobrada y el selector de imagen de restaurante/nuevo se quedan con `.clickeable`.

### A3 · Botones nativos con estilos sueltos
156 `<button>` nativos en 91 archivos frente a 280 `<Button>`. Muchos son correctos (tabs, chips, ítems de menú), pero
los de acción (guardar, cobrar, cancelar) deberían ir con `Button` + preset para tener el mismo tamaño, el estado
`saving` y el `disabled`. Ejemplo: `orders/restaurant/Buttons/PayButton.tsx:37` (`button-cyan` a mano).

---

## 6. Documentación
- `CLAUDE.md` dice que la tabla de "IDs de Modales en Uso" tiene 11 ids; hoy hay más de 60. Quitar la lista o
  apuntar a `grep "openModal('" src`.
- Agregar al `CLAUDE.md` las piezas nuevas cuando existan (`StatusBadge`, `Spinner`, `ToasterMessage` único en el
  layout) y la tabla de equivalencias de colores de la sección 2.
