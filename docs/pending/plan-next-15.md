# Plan: subir Next.js de 14.2.32 a 15.5.29

Estado: por revisar (2026-11-11).

## Por qué

Next 14 ya no recibe parches de seguridad (la última es 14.2.35). Después del `npm audit fix` del 2026-11-11 (commit `3b1a5ed`), las alertas que quedan en pulse son de `next` y de lo que arrastra:

- **Críticas:** ejecución remota de código en el optimizador de imágenes (`/_next/image`) con SVG o AVIF, que se corrige en 15.5.28 o una versión posterior. Hay otra de RCE solo en servidores Windows.
- **Altas y moderadas:** DoS en Server Components, envenenamiento de caché de RSC, SSRF en rewrites y en upgrades de WebSocket, XSS con CSP nonces y DoS en la optimización de imágenes.
- **Desarrollo:** `eslint-config-next` 14 trae `glob`, `minimatch` y `@typescript-eslint/*` vulnerables, y el `postcss` interno de `next` también lo está. Se resuelven al subir los dos paquetes a 15.5.29.

`15.5.29` es la rama `backport` de Next: corrige todo lo anterior sin el salto a 16 (Turbopack por defecto, `middleware` renombrado a `proxy`, sin `next lint`).

**Lo que no aplica hoy en pulse**, para medir la urgencia: Server Actions (no hay `'use server'`), Pages Router con i18n y el RCE de Windows, si el servidor es Linux. El RCE de imágenes sí aplica si pulse corre con `next start` en un servidor propio: `next.config.mjs` acepta imágenes remotas de `api.latam-pos.com`.

## Lo que cambia y dónde pega en pulse

Revisado contra el código el 2026-11-11.

### 1. `params` llega como Promise

En Next 15, el `params` de las páginas y layouts es una `Promise`. En los componentes cliente la lectura síncrona todavía funciona con un warning, pero los tipos de `PageProps` ya no la aceptan y `next build` falla.

| Archivo | Hoy | Cambio |
|---|---|---|
| `src/app/products/[id]/edit/page.tsx` | `'use client'`, `({ params }: { params: { id: string } })` | `useParams()` de `next/navigation`, como ya hacen `contacts/[id]` y `maintenance/[id]` |
| `src/app/products/[id]/kardex/page.tsx` | igual | igual |
| `src/app/invoicing/search/[id]/page.tsx` | igual | igual |
| `src/app/pedido/[token]/page.tsx` | igual, con `params.token` | igual |
| `src/app/pedido/[token]/layout.tsx` | `generateMetadata({ params })` en el servidor | `params: Promise<{ token: string }>` y `const { token } = await params` |

`contacts/[id]`, `contacts/[id]/edit` y `maintenance/[id]` ya usan `useParams()`: no cambian. `useSearchParams()` no cambia.

### 2. React 19 en el App Router

Next 15 acepta React 18 en `package.json`, pero el App Router usa su React 19 interno. Conviene subir `react`, `react-dom`, `@types/react` y `@types/react-dom` a 19 para que los tipos y el runtime coincidan.

- Librerías revisadas, todas aceptan React 19: `react-hook-form` 7.62, `react-chartjs-2` 5, `react-simple-keyboard`, `react-hot-toast`, `react-icons`, `zustand` 4.5 y `next-auth` 4.24.15.
- En el código no hay `defaultProps`, `propTypes`, `forwardRef`, `findDOMNode`, `useRef<T>()` sin valor inicial ni `JSX.Element` global. `React.FC` sigue funcionando (`DateRange`, `RadioButton`, `Switch`, `types/flowbite-react.d.ts`).
- Con `@types/react` 19, revisa lo que marque `tsc`. Lo típico: `useRef` exige un argumento, los callbacks de `ref` no pueden devolver un valor y `ReactElement['props']` pasa a `unknown`.

### 3. Caché de `fetch` y de los route handlers

En 15, `fetch` y los `GET` de route handlers ya no se cachean por defecto. pulse no depende de eso: los `fetch` de `pedido/[token]/layout.tsx` ya llevan `cache: 'no-store'`, y el route handler de NextAuth es dinámico. No hace falta cambiar nada.

### 4. `next lint`

En 15.5, `next lint` funciona pero avisa que se retira en 16. El script `lint` de `package.json` se puede quedar así, o pasar a `eslint .` (ESLint 8 sigue soportado por `eslint-config-next` 15).

### 5. Sin cambios esperados

- `src/middleware.ts` (`getToken` de next-auth y redirecciones): la API es la misma en 15.
- `next.config.mjs` (`images.remotePatterns`): sin cambios. Es buen momento para decidir si `http://connect.test` debe quedar fuera de producción.
- `next/image` (27 archivos): misma API en 15.
- Node: local 24, y Next 15 pide 18.18 o una versión posterior. Revisa la versión del servidor.

## Fases

### Fase 1: dependencias

```bash
npm install next@15.5.29 eslint-config-next@15.5.29 react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19
```

Luego `npm audit` debería quedar sin `next`, `postcss`, `glob` ni `minimatch`.

### Fase 2: código

1. Los cinco archivos de la tabla del punto 1.
2. `npx tsc --noEmit -p .` y corregir lo que marquen los tipos de React 19.
3. `npm run lint` y `npm run build`.

### Fase 3: pruebas a mano (`npm run dev` y también `npm run build && npm start`)

- Login: normal, con "Recordar usuario", cuentas recordadas y cambio de tenant (`ChangeTenantModal`).
- La sesión se renueva (refresh token) y el logout revoca el token.
- El middleware redirige sin sesión, con sesión en `/` y en modo mantenimiento.
- Páginas con `params`: editar producto, kardex, buscar factura por id, pedido público `/pedido/[token]` (y su título y vista previa con `generateMetadata`).
- Órdenes de productos y de restaurante: cobro, impresión, Reverb/Pusher (`laravel-echo`) y teclado en pantalla (`react-simple-keyboard`).
- Dashboard (Chart.js), reportes, formularios con `react-hook-form` y toasts.
- Imágenes remotas de productos (`next/image` con `api.latam-pos.com`).

### Fase 4: publicar

Commit en `develop` y deploy a testing antes de producción. Al terminar, resume el plan en `docs/planes-terminados.md`, bórralo de `docs/pending/` y actualiza el punto 1 de `docs/pending/auditoria-seguridad.md`.

connect-app es Expo, no Next: no se anota en `cambios-pendientes-pulse.md`.

## Mitigación mientras tanto (opcional)

Si el upgrade tarda y pulse corre con `next start` en un servidor propio, el riesgo crítico es `/_next/image`. Se puede reducir con `images: { unoptimized: true }` en `next.config.mjs`: las imágenes se sirven sin optimizar y sin pasar por ese endpoint, a cambio de pesar más. Antes de depender de esto, comprueba en el build que `/_next/image` ya no procese imágenes. Si pulse está en Vercel, la optimización corre en la infraestructura de Vercel y este punto pesa menos.

## Por decidir

- Si pulse corre con `next start` en un servidor propio (y en qué versión de Node) o en Vercel.
- Si se aplica la mitigación de `unoptimized` antes del upgrade.
- Si `lint` se queda con `next lint` o pasa a `eslint .`.
