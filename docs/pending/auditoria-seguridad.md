# Auditoría de seguridad — pulse

> Lo que queda de pulse de la auditoría conjunta del 2026-10-21, revisado contra el código el 2026-11-09. El texto completo de esa auditoría está en el historial de git de connect (`docs/pending/auditoria-seguridad-2026-10-21.md`). Revisión estática más `npm audit`.
> Cada proyecto tiene su archivo: `connect/docs/pending/auditoria-seguridad.md`, `billing/docs/pending/auditoria-seguridad.md` y `connect-manager/docs/pending/auditoria-seguridad.md`.
> **Documento sensible**: describe cómo atacar sistemas en producción. No lo subas a un repo público ni lo compartas fuera del equipo.

Estado: por revisar.

## Resumen de lo pendiente

| # | Sev. | Hallazgo |
|---|---|---|
| 1 | ALTA | `npm audit --omit=dev`: 14 vulnerabilidades (2 críticas, 8 altas) |
| 2 | MEDIA | `NotificationBell` renderiza HTML del manager sin sanitizar |
| 3 | MEDIA | `accessToken` expuesto a JS en la sesión y sin CSP ni `X-Frame-Options` |
| 4 | BAJA | `config-storage` en localStorage "cifrado" con una clave del bundle |

## Ya corregido

| Auditoría del 2026-10-21 | Estado |
|---|---|
| #7 ALTA: `tenantUrl` del cliente en NextAuth (SSRF y fuga de `AUTH_SECRET_ID`) | La URL de `oauth2` sale siempre de `NEXT_PUBLIC_URL_API` (commit `3bf3882`). `token.url` viene de `remote_urls` de billing. |
| #16 (parte): `refreshToken` expuesto a JS | El callback `session` ya no lo copia. |

---

## 1. ALTA — dependencias

`npm audit --omit=dev` (2026-11-09): 14 vulnerabilidades (4 moderadas, 8 altas, 2 críticas), las mismas que el 2026-10-27: `next` (≤ 16.3.0-preview), `next-auth` (≤ 4.24.14), `axios`, `follow-redirects`, `form-data`, `ws`, `socket.io-parser`, `nanoid`, `uuid`, `postcss`, `preact`, `source-map-js`.

**Corrección:** `npm audit fix` para lo que no rompe y planear la subida de `next` y `next-auth`. Anotar el cambio para connect-app en `cambios-pendientes-pulse.md` si también lo necesita.

**Avance (2026-11-11):** `npm audit fix` sin `--force` (commit `3b1a5ed`) subió `next-auth` a 4.24.15 (cierra la crítica del normalizador de email), `axios` a 1.21.1 y parcheó `follow-redirects`, `form-data`, `ws`, `socket.io-parser`, `nanoid`, `uuid`, `preact` y `source-map-js`. Queda `next` 14.2.32, con su `postcss` interno y la cadena de desarrollo de `eslint-config-next`: se sube a 15.5.29 con `docs/pending/plan-next-15.md`.

## 2. MEDIA — XSS en notificaciones

`src/components/notifications/NotificationBell.tsx:133`: `dangerouslySetInnerHTML={{ __html: selectedNotification.content }}`. El contenido lo escribe cualquier usuario del manager de billing (sin roles, por decisión) y se envía a todos los tenants o a los elegidos. Una cuenta del manager robada ejecuta JS en el pulse de todos los clientes y, con el 3, se lleva sus sesiones.

**Corrección:** sanitizar con DOMPurify (lista blanca de etiquetas de formato) antes de renderizar.

## 3. MEDIA — sesión expuesta a JS y sin cabeceras de seguridad

- `src/app/api/auth/[...nextauth]/route.ts`: el callback `session` copia `accessToken` a la sesión, que JS lee con `useSession()`. El token de connect dura 6 meses (ver el archivo de connect): cualquier XSS lo roba.
- `next.config` no define CSP, `X-Frame-Options` ni `X-Content-Type-Options`.

**Corrección:** CSP con `script-src 'self'` (más lo que haga falta para Reverb) y `frame-ancestors 'none'`; a futuro, que las llamadas a connect pasen por route handlers del servidor para no exponer el token.

## 4. BAJA — localStorage con clave pública

`src/stores/configStore.ts` persiste la configuración (`config-storage`) cifrada con `NEXT_PUBLIC_ENCRYPT_CLIENT_ID`, que va en el bundle. Desde el 2026-10-22 connect ya no manda las credenciales del MH ni los datos de infraestructura del tenant, así que hoy solo guarda configuración, pero el cifrado no protege nada: no guardar ahí nada sensible.
