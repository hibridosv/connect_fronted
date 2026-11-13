# Pulse

![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Frontend web del punto de venta (POS) de Hibrido. Es la aplicación que usa cada negocio para vender, llevar el inventario, la caja, las cuentas, el restaurante y la facturación electrónica.

## El ecosistema

| Proyecto | Qué es |
|---|---|
| **pulse** (este repo, `connect_fronted`) | Frontend web del negocio. |
| **connect** | Backend del POS. Una base de datos por negocio (tenant). |
| **billing** | El landlord: tenants, inicio de sesión, facturación electrónica y mensualidades. |
| **connect-app** | Port de pulse a Expo / React Native. |

```
pulse ──oauth2──▶ billing ──devuelve token + URL del connect del tenant
pulse ──Bearer──▶ connect ({url}/api/v2)
pulse ◀──Reverb (WebSocket)── connect (impresión, cocina, despacho, notificaciones)
```

- **Inicio de sesión:** NextAuth llama a `oauth2` de billing. La respuesta trae el token y la URL del connect del negocio, y desde ahí todas las peticiones van a esa URL.
- **Tipos de sistema:** el mismo frontend atiende comercios y restaurantes. Las pantallas y funciones cambian según el tipo de sistema, el plan, los permisos del usuario y las configuraciones activas del negocio.

El mapa completo está en `connect/docs/contexto-ecosistema.md`.

## Stack

- Next.js 14 (App Router) y React 18
- TypeScript 5
- Tailwind CSS 3.4 con variables CSS para los temas
- Zustand (estado global)
- NextAuth.js (credenciales contra Laravel Passport)
- Axios, centralizado en `httpService`
- Laravel Echo con Reverb (tiempo real)
- React Hook Form, React Hot Toast, Luxon, Chart.js y React Icons

## Puesta en marcha

Requiere Node.js 20 o superior.

```bash
git clone https://github.com/hibridosv/connect_fronted.git
cd connect_fronted
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Crea un archivo `.env` en la raíz con estas variables:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_URL_API` | URL de la API de billing, con `/` al final. Se usa para el inicio de sesión y las descargas de documentos. |
| `NEXT_PUBLIC_URL` | URL pública de pulse. |
| `NEXTAUTH_URL` | URL de la aplicación, para NextAuth. |
| `NEXTAUTH_SECRET` | Clave para firmar la sesión de NextAuth. |
| `AUTH_CLIENT_ID`, `AUTH_SECRET_ID` | Cliente OAuth de Passport. |
| `NEXT_PUBLIC_ENCRYPT_CLIENT_ID` | Clave para el cifrado en el navegador. |
| `NEXT_PUBLIC_REVERB_KEY`, `NEXT_PUBLIC_REVERB_HOST`, `NEXT_PUBLIC_REVERB_PORT`, `NEXT_PUBLIC_REVERB_SCHEME` | Conexión a Reverb. |
| `NEXT_PUBLIC_APP_NAME` | Nombre que muestra la aplicación. |
| `MAINTENANCE_MODE` | Con `true`, toda la aplicación redirige a la página de mantenimiento. |

Otros comandos:

```bash
npm run build   # compila para producción
npm run start   # sirve la compilación
npm run lint    # ESLint
```

## Estructura

```
src/
├── app/          Páginas (App Router) y el endpoint de NextAuth
├── components/   Componentes, organizados por dominio
├── hooks/        Hooks por dominio (use*Logic) y hooks de peticiones
├── stores/       Stores de Zustand por dominio
├── services/     httpService (Axios) y wrappers de la API
├── interfaces/   Tipos de los modelos de datos
├── lib/          Utilidades: moneda, fechas, permisos, URLs
├── providers/    SessionProvider y manejo del tema
├── styles/       Estilos globales y variables de los temas
└── middleware.ts Protege las rutas que requieren sesión
```

### Páginas

| Ruta | Contenido |
|---|---|
| `/` | Inicio de sesión. |
| `dashboard` | Resumen del negocio y recomendaciones. |
| `orders` | Ventas: `products` para comercio y `restaurant` para restaurante. |
| `restaurant` | Menú, órdenes, pantalla de cocina (`screen`), despacho (`counter`) y eliminados. |
| `products` | Inventario: productos, ingresos, kardex, vencimientos y stock. |
| `invoicing` | Documentos, facturación electrónica, rechazados, notas de remisión y correlativos. |
| `annexes` | Anexos de IVA, libro de compras y descarga de JSON y PDF. |
| `cash`, `cashdrawers` | Cuentas, gastos, remesas, transferencias, cajas y cortes. |
| `accounts` | Cuentas por cobrar y por pagar. |
| `history`, `reports` | Historiales y reportes. |
| `tools` | Ajustes, cotizaciones, comisiones e importaciones. |
| `transfers` | Traslados entre sucursales. |
| `maintenance` | Órdenes de taller. |
| `contacts` | Clientes, proveedores y empleados. |
| `chatbot` | Conversaciones y pedidos del chatbot de WhatsApp. |
| `settings` | Configuración general, sucursales, usuarios, permisos, productos, pagos y chatbots. |
| `payments` | Mensualidad del negocio. |
| `pedido/[token]` | Pantalla pública de pedido para los clientes del chatbot. No requiere sesión. |
| `redirects` | Avisos según el estado del negocio: por vencer, vencido, suspendido y mantenimiento. |

## Temas

Los colores son variables CSS definidas en `src/styles/globals.css`. El tema activo se fija con el atributo `data-theme` en `<html>` y se guarda con `themeStore`. Hay cuatro temas: `mdb` (por defecto), `blue`, `green` y `navy`. Más detalle en [`THEME_GUIDE.md`](THEME_GUIDE.md).

## Convenciones

- Los imports usan el alias `@/` para `src`.
- La lógica de cada pantalla va en un hook `use*Logic` y el estado en un store de Zustand por dominio.
- Todas las peticiones pasan por `httpService`, que agrega el token y renueva la sesión.
- La interfaz está en español.
- Los mensajes de commit van en español.

El detalle está en [`CLAUDE.md`](CLAUDE.md) y en [`.claude/rules/memoria-proyecto.md`](.claude/rules/memoria-proyecto.md).

## Ramas

- `develop`: rama de trabajo.
- `main`: rama principal.

Cada cambio de funcionalidad en pulse se anota en `connect-app/docs/cambios-pendientes-pulse.md` para portarlo después a connect-app.

## Documentación

- [`CLAUDE.md`](CLAUDE.md): referencia técnica, convenciones y patrones.
- [`THEME_GUIDE.md`](THEME_GUIDE.md): guía de temas.
- [`docs/planes-terminados.md`](docs/planes-terminados.md): resumen de los planes ya implementados.
- [`docs/pending/`](docs/pending): planes y análisis por hacer.

## Licencia

Proyecto de código cerrado, propiedad de **Hibrido**. Todos los derechos reservados.
