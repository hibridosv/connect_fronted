> **Estado: corregido.** Las 4 causas descritas abajo ya están implementadas
> (`LoadingPage.tsx` con watchdog, `jwt` callback limpia el token roto,
> `SessionSyncer` fuerza `signOut` en `RefreshAccessTokenError`, y
> `httpService.ts` cuenta 401 por token en vez de con un contador global). Este
> documento queda como referencia del diagnóstico original.

# Análisis: el sistema se "cuelga" tras estar inactivo mucho tiempo (ningún botón responde, hay que refrescar)

Investigación del reporte: después de dejar la pestaña abierta e inactiva por un
periodo largo, al volver ningún botón reacciona (ni siquiera el Navbar), y la
única forma de recuperar el sistema es refrescar la página manualmente.

No se modificó código, esto es solo diagnóstico para abordar después.

---

## Causa principal — `<Suspense>` con overlay de pantalla completa que puede quedarse esperando una promesa que nunca resuelve ni rechaza

**Patrón repetido en 17 layouts** (`dashboard`, `products`, `orders`, `invoicing`,
`cash`, `accounts`, `contacts`, `history`, `reports`, `settings`, `tools`,
`transfers`, `annexes`, `cashdrawers`, `help`, `payments`, `restaurant`):

```tsx
// src/app/dashboard/layout.tsx (idéntico en los otros 16 layouts)
'use client'
const Layout = ({ children }) => (
  <div>
    <Navbar />
    <div className="w-full h-full">
      <Suspense fallback={<LoadingPage />}>
        {children}
      </Suspense>
    </div>
  </div>
);
```

`LoadingPage` (`src/components/LoadingPage.tsx:7`) renderiza:

```tsx
<div className="fixed inset-0 z-50 flex flex-col items-center justify-center ...">
```

Es decir: un overlay `fixed inset-0` que cubre **todo el viewport**.

### Por qué bloquea hasta el Navbar

`Navbar.tsx:26` usa `sticky top-0 z-50` — el **mismo** z-index que `LoadingPage`.
Con z-index empatado, gana el elemento que aparece **después** en el DOM. En el
layout, `<Suspense>` se renderiza después de `<Navbar/>`, así que el fallback,
cuando está activo, queda **por encima del Navbar también**. Esto explica por qué
el reporte dice que *ningún* botón responde, no solo los del contenido de la
página — el overlay intercepta los clics de toda la pantalla, botones de tema,
menú, todo.

### Por qué se queda pegado ahí para siempre

Este `<Suspense>`, al estar dentro de un layout `'use client'`, es exactamente el
mecanismo que usa Next.js App Router para mostrar un estado de carga durante
**navegaciones del lado del cliente** dentro de esa sección (equivalente a un
`loading.tsx` manual): cada vez que el usuario navega a otra página dentro de
`/products/*`, `/orders/*`, etc., React suspende `{children}` mientras se
obtiene el payload RSC de la nueva ruta, y muestra `LoadingPage` mientras tanto.

El problema es que **no existe ningún timeout, abort ni `error.tsx`** asociado:

- No hay `loading.tsx` ni `error.tsx` en ninguna ruta (`find src/app -iname
  error.tsx -o -iname loading.tsx` no devuelve nada).
- El `fetch` interno de Next para el RSC payload no tiene límite de tiempo.
- React Suspense no tiene mecanismo de "expiración": si la promesa nunca se
  resuelve ni se rechaza, el fallback queda montado **indefinidamente**. Un error
  boundary tampoco ayuda aquí porque nunca se lanza un error — la promesa
  simplemente nunca se resuelve.

### Por qué el disparador es justo "mucho tiempo inactivo"

Cuando una laptop/tablet se suspende, el WiFi se reconecta, hay un proxy/firewall
corporativo que cierra conexiones TCP ociosas, o el sistema operativo limita
temporizadores/red de una pestaña en segundo plano por mucho tiempo, es muy común
que una conexión HTTP quede "colgada" (ni error ni respuesta) al volver. Si el
usuario justo en ese momento (o Next.js hace un prefetch/revalidación en segundo
plano) dispara una navegación cuyo fetch cae en esa conexión muerta, el
`<Suspense>` se activa y el `fetch` jamás resuelve ⇒ `LoadingPage` se queda fijo
en pantalla para siempre ⇒ **todo el árbol queda cubierto por el overlay y sin
recibir clics** ⇒ la única salida es refrescar (lo que fuerza una conexión nueva).

---

## Factor agravante — el refresh de token fallido no cierra sesión ni limpia el estado

`src/app/api/auth/[...nextauth]/route.ts:5-31` (`refreshAccessToken`) y
`src/app/api/auth/[...nextauth]/route.ts:93-97` (`jwt` callback):

```ts
if (Date.now() < token.expiresAt) return token
return refreshAccessToken(token)
```

```ts
if (!res.ok) {
  return { ...token, error: 'RefreshAccessTokenError' }
}
```

Si el `refresh_token` también expiró (algo bastante probable tras horas de
inactividad), `refreshAccessToken` **no limpia** `accessToken`/`refreshToken` —
solo agrega `error: 'RefreshAccessTokenError'` y conserva el `accessToken` viejo
ya inválido.

`src/providers/providers.tsx:22-36` (`SessionSyncer`) solo revisa
`session?.accessToken && session?.url` para decidir si llama `setSession` o
`clearSession` — nunca revisa `session.error`. Como el token viejo (inválido)
sigue presente, siempre llama `setSession` con un token que el backend va a
rechazar con 401 en cada petición, sin que la app lo detecte ni redirija al
login automáticamente por esta vía.

`src/services/httpService.ts:9-10,59-67` sí tiene un mecanismo de recuperación
(`signOut` tras 3 respuestas 401 consecutivas), pero `unauthorizedCount` es una
variable de módulo **compartida por todas las peticiones**, y se resetea a `0`
en **cualquier** respuesta exitosa (línea 49), sin importar de qué endpoint
venga. En una página con varios hooks `use*Logic` pidiendo datos en paralelo, si
aunque sea una petición no relacionada tiene éxito (p. ej. algo servido desde
caché intermedio, o que no requiere el token vencido), el contador nunca llega a
3 y el `signOut` automático no se dispara — la sesión rota persiste
silenciosamente.

Esto no genera el freeze de UI por sí solo (no bloquea clics), pero sí
prolonga/oculta el problema: el usuario ve peticiones fallando en silencio antes
de eventualmente toparse con el freeze real (causa principal), lo que hace más
confuso diagnosticar "por qué nada funciona" a simple vista.

---

## Orden de probabilidad de ser la causa reportada

1. **`<Suspense fallback={<LoadingPage/>}>` sin timeout, cubriendo toda la
   pantalla con `z-50` incluyendo al Navbar** — explica exactamente el síntoma
   descrito (ningún botón responde, ni siquiera navegación, y solo un refresh
   manual lo arregla). Se dispara con conexiones muertas tras reanudar de
   inactividad/suspensión, algo frecuente en ese escenario.
2. **`refreshAccessToken` fallido no limpia la sesión ni fuerza `signOut`,
   combinado con el contador global de 401 que se resetea con cualquier éxito no
   relacionado** — agrava y enmascara el problema, puede generar peticiones
   fallidas silenciosas previas al freeze visual.

---

## Posibles direcciones de fix (pendiente de decidir, no implementado)

- Agregar un timeout/watchdog en `LoadingPage` (o en el `Suspense` mismo vía un
  wrapper): si el fallback lleva más de N segundos montado, forzar
  `window.location.reload()` o mostrar un botón de "Reintentar" — soluciona el
  síntoma inmediato (ya no haría falta que el usuario sepa que debe refrescar).
- Evaluar reemplazar el patrón manual `<Suspense fallback={<LoadingPage/>}>` en
  cada layout por `loading.tsx` de Next.js por ruta, y agregar `error.tsx` como
  boundary hermano — no elimina el problema de fetch colgado, pero es el patrón
  soportado por el framework y permite reaccionar mejor a fallos de navegación.
- Detectar reanudación desde inactividad (`document.visibilitychange` con medición
  de tiempo oculto) y forzar `router.refresh()` o una revalidación de sesión
  proactiva al volver, en vez de esperar a que el usuario dispare una navegación
  contra una conexión potencialmente muerta.
- En `jwt` callback de NextAuth: si `refreshAccessToken` falla, limpiar
  `accessToken`/`refreshToken` (o dejar que `session.error` se propague) y en
  `SessionSyncer` revisar `session.error === 'RefreshAccessTokenError'` para
  forzar `signOut` inmediatamente en vez de seguir usando un token roto.
- Aislar `unauthorizedCount` por request/endpoint (o simplemente quitar la
  lógica de "3 seguidos" y disparar `signOut` en el primer 401 confirmado tras
  reintento), para que la recuperación automática de sesión no dependa de que
  *todas* las peticiones en vuelo fallen a la vez.
