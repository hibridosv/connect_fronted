# Auditoría de pulse: seguridad, lógica, recargas, storage y toasts

Fecha: 2026-11-09 · Rama revisada: `developer` (`2d9d582`)
Estado: en curso (SEC1 aplicado en código, falta cambiar el secreto; el resto por implementar)

Revisión del código de `src/` (752 archivos). `npx tsc --noEmit` y `npx next lint` salen limpios, pero el lint no ve
mucho porque hay 49 `eslint-disable react-hooks/exhaustive-deps`. Algunos puntos dependen de connect o billing; se
marcan con **[connect]** o **[billing]**.

Los análisis anteriores `IDLE_FREEZE_BUG_ANALYSIS.md` y `SEARCH_LOADING_BUG_ANALYSIS.md` ya están corregidos.
`LAYOUT_CONSOLIDATION_PLAN.md` sigue pendiente y resuelve R2 (abajo).

## Orden sugerido

| # | ID | Qué | Esfuerzo |
|---|----|-----|----------|
| 1 | SEC1 | Quitar `tenantUrl` del login (se filtra el `client_secret`) | bajo |
| 2 | SEC2 | No dejar que el cliente cambie `tenantStatus` (saltarse la suspensión) | bajo |
| 3 | T1 | Un solo `<ToasterMessage />` en el layout (hay 41 páginas sin él) | bajo |
| 4 | T2 | Listas vacías (404): sin toast rojo y sin datos viejos | medio |
| 5 | R3 | `useReverb` se sale del canal para todos los que lo comparten | bajo |
| 6 | S2 | Permisos y flags cacheados 24 h sin aviso de cambio | medio |
| 7 | SEC3, SEC4, SEC5 | `refreshToken` en el cliente, HTML de notificaciones sin sanear y headers de seguridad | bajo |
| 8 | R1, R2 | Suscripciones a stores completos y layouts duplicados | medio/alto |
| 9 | Resto | Puntos bajos | bajo |

---

## 1. Seguridad

### SEC1 · Crítico · El login acepta `tenantUrl` del cliente y le manda ahí el `client_secret`
`src/app/api/auth/[...nextauth]/route.ts:48`

> **Estado (2026-11-09):** se quitó `tenantUrl` de `credentials` y el login usa siempre `NEXT_PUBLIC_URL_API`.
> **Pendiente:** cambiar `AUTH_SECRET_ID` en billing y en el `.env` de pulse.

```ts
const baseUrl = credentials?.tenantUrl ?? process.env.NEXT_PUBLIC_URL_API;
const res = await fetch(`${baseUrl}oauth2`, { body: JSON.stringify({ client_id: process.env.AUTH_CLIENT_ID, client_secret: process.env.AUTH_SECRET_ID, ... }) })
```

- Ningún componente de pulse manda `tenantUrl` (solo `ChangeTenantModal` manda `change`), pero cualquiera puede hacer
  POST a `/api/auth/callback/credentials` con `tenantUrl=https://servidor-del-atacante/` (el token CSRF de NextAuth se
  obtiene sin sesión en `/api/auth/csrf`).
- **Impacto:** el servidor de Next envía `AUTH_CLIENT_ID` y `AUTH_SECRET_ID` (el cliente Passport de password grant) al
  atacante. Con ese secreto se puede pedir tokens directo a `/oauth/token` de cada connect sin el `throttle:oauth` de
  billing, o sea, probar contraseñas sin límite. También es un SSRF: el servidor de pulse hace POST a cualquier URL,
  incluida la red interna.
- **Arreglo:** quitar `tenantUrl` de `credentials` y usar siempre `process.env.NEXT_PUBLIC_URL_API` (o una variable
  privada `AUTH_API_URL`). Después rotar `AUTH_SECRET_ID` en billing y en el `.env` de pulse, por si ya se filtró.
  Revisar si connect-app tiene lo mismo.

### SEC2 · Alto · El cliente puede poner `tenantStatus: 'Active'` y saltarse la suspensión
`src/app/api/auth/[...nextauth]/route.ts:81` · `src/middleware.ts` · `src/app/redirects/*`

```ts
if (trigger === "update" && session?.tenantStatus !== undefined) {
  token.tenantStatus = session.tenantStatus;
```

- Las pantallas `overdue`, `expiring` e `info` llaman `update({ tenantStatus: 'Active' })` para ocultar el aviso, y el
  callback acepta cualquier valor. Un usuario de un negocio **suspendido** puede hacer lo mismo desde la consola
  (`useSession().update({ tenantStatus: 'Active' })`) y el middleware lo deja pasar.
- En billing, `LoginChecker::getSystemStatus` devuelve `Suspended` para `status = 2` con `type` temporal, y connect
  sigue atendiendo a los tenants con status 1 y 2, así que hoy la suspensión total solo la aplica pulse. **[connect]**
- Además, `tenantStatus` solo se calcula al iniciar sesión: si suspenden al negocio con la sesión abierta, sigue
  trabajando hasta que salga.
- **Arreglo en pulse:** en el callback `jwt` ignorar el `update` cuando `token.tenantStatus === 'Suspended'` y aceptar
  solo `'Active'` (nunca otro valor que mande el cliente). **Arreglo de fondo [connect/billing]:** que el backend
  rechace las peticiones de un tenant suspendido, y que el refresh del token vuelva a traer el estado.

### SEC3 · Medio · El `refreshToken` está disponible en el JavaScript del cliente
`src/app/api/auth/[...nextauth]/route.ts:105`

`session.refreshToken = token.refreshToken` lo expone en `/api/auth/session` y en `useSession()`. pulse no lo usa en el
cliente (el refresco ocurre en el callback `jwt`, en el servidor). Con cualquier XSS se roba un token de larga duración.
- **Arreglo:** no copiarlo a la sesión (ni `expiresAt` si no se usa). Quitarlo también de `src/types/next-auth.d.ts`.

### SEC4 · Medio · HTML de las notificaciones sin sanear
`src/components/notifications/NotificationBell.tsx:133`

`dangerouslySetInnerHTML={{ __html: selectedNotification.content }}` muestra el HTML tal cual, con `iframe` y `video`
incluidos. Lo escribe un administrador, pero si alguien compromete esa cuenta o el contenido se arma con datos
externos, el script corre en la sesión de cada usuario de cada negocio (y tiene acceso a SEC3).
- **Arreglo:** sanear con `dompurify` (permitiendo `iframe` solo con `src` de YouTube/Vimeo) o sanear en el backend al
  guardar.

### SEC5 · Medio · Sin headers de seguridad
`next.config.mjs`

No hay `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy` ni `X-Content-Type-Options`.
Cualquiera puede meter el POS en un iframe (clickjacking sobre botones de cobro o de borrado), y la pantalla pública
`/pedido/[token]` puede pasar el token en el `Referer` a sitios externos.
- **Arreglo:** `async headers()` en `next.config.mjs` con `X-Frame-Options: DENY` (o `frame-ancestors 'none'`),
  `Referrer-Policy: strict-origin-when-cross-origin` (`no-referrer` en `/pedido/*`), `X-Content-Type-Options: nosniff`
  y una CSP inicial en modo `Report-Only` (Reverb, Sentry, imágenes de connect y billing).

### SEC6 · Bajo · El "cifrado" de `config-storage` no protege nada
`src/lib/encryptedStorage.ts` · `src/constants/index.tsx:5`

La clave es `NEXT_PUBLIC_ENCRYPT_CLIENT_ID` (va en el bundle) con respaldo `'default_client_id'`. En `config-storage` se
guardan el usuario, los permisos, el rol, la caja y los datos fiscales del negocio (`client`). Es ofuscación: está bien
mantenerla, pero no debe tomarse como protección.
- **Arreglo:** documentarlo así, quitar el respaldo `'default_client_id'` y borrar `NEXT_PUBLIC_ENCRYPT_SECRET_ID` del
  `.env`: no se usa, y por ser `NEXT_PUBLIC_` acabaría en el bundle si alguien lo usa. Ver también S3 (limpiar al salir).

### SEC7 · Bajo · Canales de Reverb públicos con id de tenant secuencial **[connect]**
`src/hooks/useReverb.ts:44` (`echo.channel(...)`)

Todos los canales (`{id}-channel-orders`, `-chatbot`, `-notify`, `-code-requests`, `-dashboard`, `-pay`, `-menu`) son
públicos. Con la key de Reverb (pública) y el id numérico del tenant, cualquiera puede escuchar los eventos. Hoy los
payloads son poco sensibles: textos de aviso, nombres de usuario y el tipo de acción (`CodeRequestEvent` no manda el
código). Aun así, revela la actividad del negocio en tiempo real.
- **Arreglo:** pasar a `echo.private(...)` con `authEndpoint` de connect (Bearer) y `routes/channels.php`. Si no,
  como mínimo no agregar datos sensibles a esos eventos.

### SEC8 · Bajo · Huecos del middleware
`src/middleware.ts`

- `/payments` no está en `protectedRoutes` ni en el `matcher`.
- Un token con `error: 'RefreshAccessTokenError'` cuenta como sesión válida; `SessionSyncer` lo corrige en el
  cliente, pero la página alcanza a renderizar.
- `/protected` y `/protected-ssr` son páginas de ejemplo de NextAuth: borrarlas.

### SEC9 · Bajo · Código muerto con "autenticación" por `md5(fecha-hora)`
`src/components/button/button-download.tsx` · `src/lib/utils.ts:27` (`dateToNumberValidate`)

`ButtonDownload` arma `?code=md5(yyyyLLddHH)`, que cualquiera puede calcular. Ya no lo usa nadie (todo pasa por
`ButtonDownloadGet` → `config/url`) y connect no valida ese `code`. Borrar el componente y `dateToNumberValidate`.

---

## 2. Lógica

### L1 · Medio · "Cancelar" en el ingreso de productos borra el ingreso entero sin confirmar
`src/app/products/add/page.tsx:41`

El botón "Cancelar" llama `deletePrincipal('registers/principal/{id}')` directamente: un clic borra el registro
principal con todos los productos cargados. Además, la página no tiene `<ToasterMessage />` (T1), así que no sale
ningún aviso.
- **Arreglo:** abrir `DeleteModal` ("Se eliminará el ingreso y sus N productos") antes de borrar.

### L2 · Medio · El total del pedido público usa precios guardados en el carrito
`src/hooks/chatbot/usePublicOrderLogic.ts:121`

El carrito se recupera de `localStorage` (por negocio, no por token) y `itemsTotal` usa `item.price` y `o.price`
guardados. Si el restaurante cambió precios entre un enlace y otro, el cliente ve un total distinto al que cobra
connect. `validCart` solo comprueba que el platillo siga en el menú.
- **Arreglo:** recalcular el precio desde `data.menu` (platillo y variante) y descartar variantes que ya no existan.

### L3 · Bajo · El contador del pedido público llega a 0 y la pantalla sigue activa
`src/app/pedido/[token]/page.tsx` (`Countdown`)

Cuando `seconds` llega a 0 no pasa nada hasta la siguiente llamada (que responde 410). Al llegar a 0 debería pasar a
`status = 'expired'` y mostrar el aviso de enlace vencido.

### L4 · Bajo · Descargas que abren `window.open` después de un `await`
`src/components/button/button-download-get.tsx:20`, `src/components/button/LinkList.tsx:30`, `src/hooks/reports/useTaxAnnexesLogic.ts:53`

El `window.open` corre en un `useEffect` después de la respuesta, fuera del gesto del usuario: Safari y algunos Chrome
lo bloquean como popup. Si pasa, el usuario no ve nada.
- **Arreglo:** abrir la pestaña en el clic (`const w = window.open('', '_blank')`) y asignar `w.location` al recibir la
  URL, o mostrar un toast con el enlace si `window.open` devuelve `null`.

### L5 · Bajo · Formularios críticos que se cierran al tocar el fondo
`src/components/modal/Modal.tsx:31` (`closeOnOverlayClick = true` por defecto)

Solo 31 de 98 modales lo desactivan. Entre los que se cierran y pierden lo escrito están `CreateCreditNoteModal` y
`AddReceivableAddModal` (plan de cuotas). Cobro, caja y contactos sí lo desactivan.
- **Arreglo:** cambiar el default a `false` en modales con formulario, o pedir confirmación si el formulario está
  `isDirty` (react-hook-form).

### L6 · Bajo · Submits sin `disabled` mientras envían
`src/app/tools/import/page.tsx:96`, `src/components/transfers/ChangeQuantityModal.tsx:51`

El preset cambia a "Guardando", pero el botón sigue activo y un doble clic manda dos peticiones. Cobro, notas de
crédito y email sí están protegidos.

### L7 · Bajo (cross-repo) · `GET electronic/send/{id}` reenvía el DTE **[connect]**
`src/components/invoicing/InvoiceDetails.tsx:146`

Es un GET que escribe (reenvía al MH). Es el único que quedó del cambio del 2026-10-27 que pasó los GET de escritura a
PUT/POST. Pasarlo a `POST` en connect y aquí, y anotar connect-app.

---

## 3. Toasts

Hoy el flujo es: el store llama `useToastMessageStore.getState().setMessage(response)` o `setError(error)`, y
`useToastMessage()` (dentro de `<ToasterMessage />`) los muestra y limpia.

### T1 · Alto · 41 páginas no montan `<ToasterMessage />`: los avisos se pierden o salen en otra pantalla
`src/components/toaster-message.tsx` se monta página por página (60 páginas). Las que no lo tienen y sí hacen
operaciones con toast:

- `cash/remittances` (crear y eliminar remesas), `products/add` (todo el ingreso de productos), `tools/quotes`,
  `invoicing/documents` y `invoicing/correlatives` (detalle con acciones), `restaurant/counter`, `restaurant/screen`,
  `products/search`, `products/[id]/kardex`, `reports/*`, `history/*`, `dashboard`, `annexes/annexes`,
  `annexes/downloads`.
- Como el store no se limpia, el mensaje queda guardado y **sale al entrar a la siguiente página que sí tenga
  Toaster**: por ejemplo, "Remesa eliminada" aparece al abrir Productos, o un error viejo aparece en Caja.
- `CodeRequestGuard.tsx` y `OrderButtons.tsx` llaman `toast()` directo y dependen de que la página tenga `<Toaster>`.
- **Arreglo:** montar un único `<ToasterMessage />` en `src/providers/providers.tsx` (o en el layout `(app)` de
  `LAYOUT_CONSOLIDATION_PLAN.md`) y quitar las 60 copias. Con eso también se arreglan los toasts directos.

### T2 · Alto · Una lista vacía muestra un toast rojo y deja los datos anteriores
connect responde `errorJson('No se encontraron registros', [], 404)` cuando no hay resultados. Casi todos los
`load*` hacen:

```ts
} catch (error) {
  set({ error: true });                                   // products sigue con la búsqueda anterior
  useToastMessageStore.getState().setError(error);        // toast rojo "No se encontraron registros"
}
```

- Ejemplo: `src/stores/products/productStore.ts:36`. Buscar "xyz" en Productos muestra el error y deja la tabla con
  los resultados de la búsqueda anterior, como si fueran de "xyz". Lo mismo pasa en cualquier listado paginado al
  borrar el último registro de la página.
- Solo 5 archivos tratan el 404: `chatbotConversationsStore`, `maintenanceImagesStore`, `adjustStore`,
  `usePublicOrderLogic` y `useContactDetailsLogic`.
- **Arreglo:** un helper común en `src/lib` (p. ej. `isEmptyResponse(error)` → `status === 404`) y en cada `load*`:
  si es 404, vaciar los datos (`set({ products: null })`) sin toast; si es otro error, vaciar o conservar según el
  caso y mostrar el toast. Empezar por los stores de búsqueda (productos, contactos, órdenes, historial).

### T3 · Medio · Toasts de éxito al solo cargar datos
`src/hooks/request/useGetRequest.ts:12` (`showMessage = true` por defecto)

- `useProductNewLogic.ts:40` y `:73` cargan la lista con el default: al entrar a "Nuevo producto" sale un toast verde
  de "registros encontrados", y al crear un producto salen dos ("Producto creado" + "encontrados").
- **Arreglo:** cambiar el default de `useGetRequest` a `false` (un GET normal no avisa) y pasar `true` solo en
  `electronic/send` (que debería ser POST, ver L7).

### T4 · Medio · Mensajes en inglés o técnicos
`src/hooks/useToastMessage.ts:15`: `error?.response?.data?.message || error.message`

- Sin conexión sale "Network Error"; con un 502 del proxy (HTML sin `message`), "Request failed with status code
  502". `httpService` no tiene `timeout`, así que una petición colgada deja el spinner para siempre: conviene ponerle
  uno (p. ej. 30 s) con su mensaje.
- Durante el cierre de sesión, `httpService` rechaza con `axios.Cancel('Sesión no disponible')` y cada petición en
  curso muestra ese toast.
- **Arreglo:** una función `errorMessage(error)` que ignore las cancelaciones (`axios.isCancel`) y traduzca:
  sin `response` → "Sin conexión con el servidor"; 401 → "Tu sesión expiró"; 403 → mensaje del backend o "No tienes
  permiso para esta acción"; 5xx sin mensaje → "Ocurrió un error en el servidor, intenta de nuevo".

### T5 · Bajo · El store solo guarda un mensaje y no evita repetidos
`src/stores/toastMessageStore.ts`

- Dos `setMessage` seguidos antes del render muestran solo el último.
- Un error repetido (p. ej. un evento de Reverb que recarga y falla) apila toasts iguales.
- Si la respuesta no trae `message` (respuestas `dataOnly` del dashboard), sale un toast verde vacío.
- **Arreglo:** que el store llame directo a `toast.success/error` con `id` derivado del texto (react-hot-toast
  deduplica por `id`) y no muestre nada si no hay texto. Con T1 resuelto, el store puede quedar como una capa delgada.

---

## 4. Recarga de componentes (renders y suscripciones)

### R1 · Medio · Suscripciones a stores completos
Zustand vuelve a renderizar cualquier componente que use el store completo cada vez que cambia **cualquier** campo:

| Llamada | Usos |
|---|---|
| `useConfigStore()` | 199 |
| `useTempStorage()` | 186 |
| `useModalStore()` | 125 |
| `useStateStore()` | 32 |
| Con selector | 1 |

- Abrir o cerrar cualquier modal, o guardar cualquier elemento temporal, renderiza de nuevo el `Navbar`, el
  `Drawer`, `SearchProductModal`, `ProductDetailsGetModal` y todas las tablas de la página. En la pantalla de venta
  (`orders/products`), cada producto agregado cambia `ordersStore`, que también se usa completo.
- **Arreglo gradual:** empezar por `Navbar.tsx`, `Drawer.tsx` y las pantallas de venta, con selectores
  (`useModalStore((s) => s.modals.payOrder)`) o `useShallow` (`zustand/react/shallow`, disponible en 4.5). Para
  `useTempStorage`, un hook `useTempElement(id)` que se suscriba solo a esa clave.

### R2 · Medio · Cada módulo vuelve a montar el Navbar
Está en `LAYOUT_CONSOLIDATION_PLAN.md`: 17 layouts idénticos. Al pasar de un módulo a otro se desmonta el Navbar, se
sale de los canales de Reverb, se piden de nuevo las notificaciones y parpadea `LoadingPage`. Pendiente de aplicar.

### R3 · Alto · `useReverb` se sale del canal para todos los que lo usan
`src/hooks/useReverb.ts:61-62`

```ts
channelRef.current.stopListening(eventName);    // quita TODOS los listeners de ese evento
if (echoInstance) echoInstance.leave(channelName); // se sale del canal para toda la app
```

Al desmontar un componente se cortan los listeners de los demás:
- `{id}-channel-pay` lo escuchan el Navbar (`useConfigLogic`) y `settings/payments` y `payments`
  (`useInvoicesLogic`). Al salir de Configuración → Pagos, el Navbar deja de enterarse de los pagos hasta que se
  vuelva a montar.
- `{id}-channel-chatbot` lo usan tres hooks (`useChatbotConversationsLogic`, `useChatbotOrdersLogic`,
  `useChatbotProfileLogic`); cualquier pantalla que monte dos y desmonte uno se queda sin eventos.
- **Arreglo:** guardar la función del listener y llamar `channel.stopListening(eventName, callback)`, y llevar un
  contador de suscriptores por canal para hacer `leave` solo cuando llegue a 0.

### R4 · Medio · El selector de tema del Drawer no sirve: el tema se impone en cada recarga de config
`src/hooks/config/useConfigLogic.ts:47-53`

Cada vez que cambia el objeto `tenant` (en cada `loadConfig` o `reloadConfig`, cada evento de pago o al abrir y
cerrar caja) se llama `setTheme('navy')` o `setTheme('green')`, y se pierde el tema que eligió el usuario en el
Drawer.
- **Decidir:** si el tema depende del sistema, quitar el selector del Drawer; si lo elige el usuario, aplicar el tema
  por sistema solo cuando no haya uno guardado.

### R5 · Bajo · Contadores relativos que se actualizan cada segundo para siempre
`src/hooks/useRelativeTime.ts:40`

Si el timestamp tiene menos de 60 s, el intervalo de 1 s nunca baja a 60 s. Cada fila tiene su propio intervalo
(`RestaurantOrdersTable`, `ScreenCard`, `TablesTime`, `NotificationBell`): con 30 órdenes en pantalla son 30 renders
por segundo.
- **Arreglo:** volver a programar el intervalo cuando pase el minuto, o un único "reloj" compartido (store o
  contexto) que avance cada 30 s.

### R6 · Bajo · Un solo `loading` para varias cargas del mismo store
`src/stores/products/productStore.ts:36,49` (`loadProducts` y `loadProduct`), `ordersStore` (`loadOrders` y
`loadOrder`)

Abrir el detalle de un producto pone la tabla en skeleton, y la primera carga que termina apaga el spinner de la
otra.
- **Arreglo:** banderas separadas (`loadingList`, `loadingDetail`).

### R7 · Bajo · Búsquedas sin control de respuestas viejas
`productStore.loadProducts`, `ContactStore` y los buscadores de órdenes

No hay `AbortController` ni número de petición: si "cam" tarda más que "camisa", la tabla termina mostrando los
resultados de "cam".
- **Arreglo:** un contador `requestId` en el store (ignorar respuestas que no sean la última) o pasar `signal` a
  `getServices`.

### R8 · Bajo · Modales que siguen abiertos al cambiar de pantalla
`src/stores/modalStorage.ts`

`modals` es global y no se limpia al navegar. Si se usa el botón Atrás del navegador con un modal abierto, al volver
la página lo muestra abierto otra vez, con el elemento viejo de `useTempStorage`.
- **Arreglo:** limpiar `modals` (y los elementos temporales de detalle) cuando cambia el `pathname`, desde el layout.

---

## 5. Storage (localStorage y caché)

| Clave | Store | Se borra al cambiar de negocio | Se borra al salir |
|---|---|---|---|
| `config-storage` | `configStore` | sí | solo al volver a montar el login |
| `menu-storage` | `restauranMenuStore` | sí | igual |
| `default-contact-storage` | `defaultContactStore` | sí | igual |
| `notification-storage` | `notificationStore` | sí | igual |
| `qr-reader-storage` | `qrReaderStore` (DTE leídos) | sí | igual |
| `theme-storage` | `themeStore` | no (correcto) | no |
| `chatbot-cart:{url}` | pedido público | no aplica | no aplica |

### S1 · Medio · Al cerrar sesión no se borran los datos del negocio
`src/components/Drawer.tsx:280`, `src/components/NavbarPayments.tsx:47`, `src/app/payments/page.tsx:134`, `src/app/redirects/suspended/page.tsx:81`

Se llama `signOut()` sin `clearTenantStorage()`. El borrado depende de que monte `src/app/page.tsx`. Si el
`signOut` falla o el usuario cierra la pestaña antes, quedan en el navegador (equipo compartido de caja) el usuario,
los permisos, los datos fiscales y el historial de DTE leídos por QR (ver SEC6).
- **Arreglo:** una función `logout()` en `src/lib` que llame `clearTenantStorage()`, `clearConfig()` y
  `sessionStore.clearSession()` antes de `signOut`, y usarla en los cuatro lugares (y en `safeSignOut`).

### S2 · Medio · Permisos y feature flags cacheados 24 h **[connect]**
`src/hooks/config/useConfigLogic.ts:7,37`

La configuración (permisos, rol, flags, caja) solo se recarga si pasaron 24 h, al abrir o cerrar caja o con
`RefreshConfigEvent`. Ese evento lo emite solo billing (`Manager/ClientsController`). Si un administrador cambia los
permisos o el rol de un usuario, o activa una feature en Configuración, los demás usuarios siguen con el menú y los
botones viejos hasta 24 h (y reciben 403 al usar algo que les quitaron). `updateConfiguration` solo actualiza el
navegador del administrador.
- **Arreglo [connect]:** emitir `RefreshConfigEvent` en `{tenant}-channel-config` al cambiar roles, permisos,
  `configurations` o la caja de un usuario. **En pulse:** además, recargar al volver a la pestaña
  (`visibilitychange`) si pasaron más de 15 min.

---

## Notas para connect-app
Al corregir SEC1, SEC3, T1/T2 y R3, revisar el código equivalente en connect-app y anotarlo en
`connect-app/docs/cambios-pendientes-pulse.md`, como piden las reglas del repo.
