# Proyecto: Pulse

Documento de referencia técnica, convenciones y patrones del proyecto.

---

## Tecnologías Principales

- **Framework**: Next.js (v14.2) con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 3.4 + Variables CSS personalizadas
- **Estado Global**: Zustand 4.5 (con middleware `persist` donde aplique)
- **Autenticación**: NextAuth.js 4.24 (CredentialsProvider contra Laravel Passport OAuth2)
- **Cliente HTTP**: Axios 1.12 centralizado en `httpService`
- **Tiempo Real**: Pusher.js + Laravel Echo (WebSocket vía Laravel Reverb)
- **Formularios**: React Hook Form 7.62
- **Notificaciones**: React Hot Toast 2.6
- **Fechas**: Luxon 3.7
- **Gráficos**: Chart.js 4.4
- **Iconos**: React Icons 5.5

---

## Integración con Backend

- **API**: El frontend consume una API REST de Laravel.
- **URL Base**: Configurada vía `process.env.NEXT_PUBLIC_API_URL` (en `.env.local`).
- **Formato de URL**: `recurso?sort=campo&included=relacion1,relacion2&filterWhere[campo]==valor&perPage=15&page=1&filter[campo]=busqueda`

### Autenticación (NextAuth.js)

- **Archivo de configuración**: `src/app/api/auth/[...nextauth]/route.ts`
- **Proveedor**: `CredentialsProvider` para autenticación usuario/contraseña contra el endpoint OAuth2 de Laravel (`oauth2`).
- **Flujo**: Se envía `grant_type: 'password'` con `client_id` y `client_secret` (variables de entorno). El backend devuelve `access_token`, `refresh_token`, `expires_at` y `url`.
- **Callbacks**: `jwt` y `session` almacenan y exponen el `accessToken`, `refreshToken`, `expiresAt` y `url` obtenidos de Laravel.
- **Extensión de sesión**: Definida en `src/types/next-auth.d.ts`.
- **Página de login**: Configurada en la ruta raíz (`/`) vía la opción `pages: { signIn: '/' }`.
- **Middleware**: `src/middleware.ts` protege rutas específicas (`/dashboard`, `/protected`, `/products`) redirigiendo usuarios no autenticados al login.

---

## Estructura del Proyecto

```
src/
├── app/                          # Páginas (App Router)
│   ├── api/auth/[...nextauth]/   # Endpoint de NextAuth
│   ├── dashboard/                # Panel principal
│   ├── products/                 # Productos
│   ├── orders/                   # Pedidos
│   ├── accounts/                 # Cuentas por cobrar/pagar
│   ├── cash/                     # Gestión de caja
│   ├── cashdrawers/              # Cajas registradoras
│   ├── contacts/                 # Contactos (clientes/proveedores)
│   ├── history/                  # Historial de transacciones
│   ├── invoicing/                # Facturación
│   ├── reports/                  # Reportes
│   ├── settings/                 # Configuración
│   ├── tools/                    # Herramientas (ajustes, cotizaciones)
│   ├── transfers/                # Transferencias de inventario
│   ├── layout.tsx                # Layout raíz
│   └── page.tsx                  # Página de login
│
├── components/                   # Componentes React (~162 archivos)
│   ├── [dominio]/                # Organizados por dominio (products/, orders/, etc.)
│   ├── button/                   # Sistema de botones con presets
│   ├── modal/                    # Componente Modal compuesto (Header, Body, Footer)
│   ├── skeleton/                 # Skeletons de carga
│   ├── Drawer.tsx                # Sidebar de navegación + selector de tema
│   ├── Navbar.tsx                # Barra de navegación superior
│   ├── Pagination.tsx            # Control de paginación
│   ├── Search.tsx                # Input de búsqueda
│   └── ViewTitle.tsx             # Título de página
│
├── hooks/                        # Hooks personalizados (~70 archivos)
│   ├── [dominio]/                # Organizados por dominio
│   ├── request/                  # Hooks HTTP (useGetRequest, usePostRequest, etc.)
│   ├── usePagination.ts          # Lógica de paginación
│   ├── useReverb.ts              # Conexión WebSocket
│   ├── useSearchTerm.ts          # Búsqueda con debounce (300ms)
│   └── useToastMessage.ts        # Integración con React Hot Toast
│
├── stores/                       # Stores de Zustand (~28 archivos)
│   ├── [dominio]/                # Organizados por dominio
│   ├── configStore.ts            # Configuración global (persistido)
│   ├── themeStore.ts             # Tema activo (persistido)
│   ├── modalStorage.ts           # Estado de modales
│   ├── toastMessageStore.ts      # Mensajes de notificación
│   ├── tempSelectedElementStore.ts  # Elementos seleccionados temporalmente
│   └── stateStorage.ts           # Estados de carga genéricos
│
├── services/                     # Capa de servicios API
│   ├── httpService.ts            # Instancia Axios con interceptores
│   ├── services.ts               # Wrappers CRUD (getServices, createService, etc.)
│   ├── OtherServices.ts          # Servicio de impresión (fetch nativo)
│   ├── Interfaces.ts             # Interfaces de servicio
│   └── enums.ts                  # Enumeraciones (PaymentType, DocumentTypes)
│
├── interfaces/                   # Interfaces de modelos de datos
│   ├── user.ts, products.ts, contact.ts, order.ts, cashdrawers.ts,
│   │   Cuts.ts, category.ts, brand.ts, location.ts, price.ts,
│   │   quantity_unit.ts, Invoiceproduct.ts, invoiceassigned.ts
│
├── lib/                          # Utilidades
│   ├── utils.ts                  # Formateo de moneda, permisos, documentos, agregaciones
│   ├── urlConstructor.ts         # Constructor de query params
│   ├── date-formats.ts           # Formateo de fechas con Luxon
│   ├── encrypt.ts                # Utilidades de encriptación (CryptoJS)
│   ├── validator-functions.tsx   # Validación de formularios
│   └── config/config.ts          # Helpers de configuración
│
├── providers/                    # Proveedores de contexto
│   └── providers.tsx             # SessionProvider + ThemeManager
│
├── styles/
│   ├── globals.css               # Estilos globales + variables CSS de temas
│   └── svg.tsx                   # Utilidades SVG
│
├── types/                        # Extensiones de tipos
│   └── next-auth.d.ts            # Extensión de Session de NextAuth
│
└── mocks/                        # Datos mock para desarrollo
```

---

## Convenciones del Proyecto

### Alias de Importación

El proyecto usa `@/*` para referenciar archivos desde el directorio `src`.

### Nomenclatura

| Elemento | Convención | Ejemplo |
|:---------|:-----------|:--------|
| Stores | `use*Store` o `*Store` | `useThemeStore`, `productStore` |
| Hooks de lógica | `use*Logic` | `useProductsLogic`, `useOrderFnLogic` |
| Hooks utilitarios | `use*` | `usePagination`, `useSearchTerm` |
| Componentes | `*Modal`, `*Table`, `*Form`, `*Details` | `ProductDetailsModal`, `OrdersTable` |
| Interfaces | Sustantivos en singular | `User`, `Product`, `Contact` |
| Enumeraciones | PascalCase plural | `DocumentTypes`, `PaymentType` |
| Clases CSS custom | kebab-case | `.button-green`, `.status-success` |

### Linting

ESLint con configuración `next/core-web-vitals` (`.eslintrc.json`).

---

## Reglas Operacionales del Agente

- **Sin comentarios de cambio inline**: No agregar comentarios al código explicando qué se cambió (ej. `// Se cambió esta línea para corregir X`). Explicar los cambios en el chat, no en el código. Solo agregar comentarios que expliquen *por qué* el código está escrito de cierta forma si la lógica es compleja.
- **Idioma de la UI**: Toda la interfaz de usuario está en español.
- **Dominio de email**: El sistema agrega `@hibridosv.com` si el usuario no provee un email completo.

---

## Sistema de Temas y Estilos

### 1. Cómo Funciona

- **Variables CSS**: Todos los colores del tema se definen como variables CSS (ej. `--color-primary`, `--color-bg-base`) en `src/styles/globals.css`.
- **Atributo `data-theme`**: Los temas se activan mediante el atributo `data-theme` en el elemento `<html>` (ej. `<html data-theme="blue">`). El selector `:root` define el tema por defecto.
- **Integración con Tailwind**: `tailwind.config.ts` lee estas variables CSS, habilitando clases como `bg-primary` o `text-text-base`. La sintaxis `rgb(var(...) / <alpha-value>)` permite modificadores de opacidad de Tailwind (ej. `bg-primary/50`).

### 2. Temas Disponibles

Todos los temas son **temas claros** (fondos claros, texto oscuro) con colores primarios oscuros para elementos de alto contraste (navbar, botones).

| Tema | Color Primario | Hex | Descripción |
|:-----|:---------------|:----|:------------|
| `mdb` (defecto) | Azul-gris oscuro | `#243A51` | Tema profesional y limpio |
| `blue` | Azul oscuro | `#162B69` | Tema vibrante con azul profundo |
| `green` | Verde oscuro | `#0C381F` | Tema fresco con verde intenso |
| `navy` | Azul marino | `#223E5A` | Tema con paleta de azul marino |

### 3. Variables CSS por Tema

```
--color-primary          Color principal (navbar, botones primarios)
--color-secondary        Primario atenuado
--color-accent           Color de acento (indigo-500 o orange-500 según tema)
--color-text-base        Texto principal (gray-900)
--color-text-muted       Texto secundario (gray-700)
--color-text-inverted    Texto sobre fondos primarios (blanco)
--color-bg-base          Fondo de página (gray-50)
--color-bg-content       Fondo de tarjetas/modales (blanco)
--color-bg-subtle        Fondos sutiles, hovers, headers de tabla (gray-200)
--color-success          Verde-700
--color-danger           Rojo-700
--color-warning          Amarillo-600
--color-info             Azul-800
```

### 4. Cambio de Tema

Gestionado por el store `themeStore` (Zustand con `persist`) y el selector visual en `Drawer.tsx`.

- **Store**: `src/stores/themeStore.ts` — Persiste en `localStorage` como `'theme-storage'`.
- **Selector visual**: Botones circulares de colores en la parte inferior del Drawer.
- **Inicialización**: `useInitializeTheme` en `src/providers/providers.tsx` aplica el tema guardado al cargar la app.

### 5. Convenciones de Estilo en Componentes

#### Contenedores tipo tarjeta
```
bg-bg-content rounded-lg shadow-sm border border-bg-subtle
```

#### Colores de texto
| Clase | Uso |
|:------|:----|
| `text-text-base` | Texto principal |
| `text-text-muted` | Texto secundario/atenuado |
| `text-text-inverted` | Texto sobre fondos primarios (navbar, botones) |

#### Fondos
| Clase | Uso |
|:------|:----|
| `bg-bg-base` | Fondo principal de página |
| `bg-bg-content` | Fondo de tarjetas, modales |
| `bg-bg-subtle` | Fondos sutiles, hovers, headers de tabla, bordes |

#### Colores semánticos
`text-success`, `text-danger`, `text-warning`, `text-info` para indicadores de estado.

#### Estilos de tabla
| Elemento | Clases |
|:---------|:-------|
| Header | `bg-bg-subtle/60 text-text-base border-b-2 border-bg-subtle` |
| Bordes verticales (header) | `border-r border-bg-subtle` |
| Bordes verticales (body) | `divide-x divide-bg-subtle` en `<tr>` |
| Divisores de fila | `divide-y divide-bg-subtle` en `<tbody>` |
| Zebra striping | `odd:bg-bg-subtle/40` en `<tr>` |
| Hover | `hover:bg-bg-subtle` en `<tr>` |
| Estado condicional | `bg-danger/10 text-danger` para indicadores (ej. sin stock) |

#### Diseño responsivo
Componentes como `Pagination` usan `flex-wrap` y visibilidad condicional (`hidden sm:inline`).

### 6. Clases CSS Utilitarias Personalizadas (globals.css)

| Clase | Descripción |
|:------|:------------|
| `.input` | Estilo estándar para inputs |
| `.input-disabled` | Input deshabilitado |
| `.input-select` | Select estilizado |
| `.input-label` | Etiqueta de campo |
| `.input-radio` | Radio button personalizado |
| `.button-*` | Variantes de botón (grey, lime, cyan, green, red, etc.) |
| `.status-*` | Indicadores de estado (success, danger, info, warning) |
| `.clickeable` | Cursor pointer con efecto active |
| `.custom-scrollbar` | Scrollbar personalizado (Webkit y Firefox) |

### 7. Animaciones

- `shimmer` — Animación de skeleton de carga (1.5s infinite), definida en Tailwind config.

### 8. Componente Modal

El componente `Modal` (`src/components/modal/Modal.tsx`) acepta un prop `size` para controlar el ancho.

| Prop `size` | Clase Tailwind |
|:------------|:---------------|
| `xs` | `max-w-xs` |
| `sm` | `max-w-sm` |
| `md` | `max-w-md` |
| `lg` | `max-w-lg` |
| `xl` | `max-w-xl` |
| `xl2` | `max-w-2xl` |
| `xl3` | `max-w-3xl` |
| `xl4` | `max-w-4xl` |
| `xl5` | `max-w-5xl` |
| `xl6` | `max-w-6xl` |
| `xl7` | `max-w-7xl` |
| `full` | `max-w-full` |

Subcomponentes: `Modal.Header`, `Modal.Body`, `Modal.Footer`.

### 9. Sistema de Botones

El componente `Button` (`src/components/button/`) utiliza un sistema de **presets** con 30+ variantes predefinidas:
- Primarios: Primary, Secondary, Danger, Success, Info, Warning
- Acciones: Close, Cancel, Save, Accept, Add, Send
- Estados: Saving, Submitting, Loading
- Pequeños: smallClose, smallPlus, smallEdit, etc.

---

## Stores de Zustand — Patrones y Referencia

### Patrón General de un Store

Todos los stores siguen esta estructura consistente:

```typescript
// Estado típico
{
  datos: any | null,        // Datos principales (lista)
  dato: any | null,         // Dato individual (detalle)
  error: boolean,           // Estado de error
  loading: boolean,         // Estado de carga principal
  saving: boolean,          // Estado de guardado
  deleting: boolean,        // Estado de eliminación
  sending: boolean,         // Estado de envío
}

// Acciones típicas
loadDatos(url)              // GET → actualiza datos + loading/error
createDato(data)            // POST → toast éxito/error
updateDato(url, data)       // PUT → toast éxito/error
deleteDato(url)             // DELETE → toast éxito/error
```

### Convenciones de los Stores

1. **Un store por dominio funcional** — Cada módulo (productos, contactos, caja, etc.) tiene su propio store.
2. **Loading/error combinados** — Cada store maneja sus propios estados de carga y error.
3. **Las acciones llaman servicios** — Las acciones del store invocan `getServices`, `createService`, etc. del servicio centralizado.
4. **Toast en acciones** — Tras operaciones exitosas o fallidas, se muestra un toast vía `toastMessageStore`.
5. **Modales separados** — El estado de visibilidad de modales se gestiona en `modalStorage.ts`, no en los stores de dominio.
6. **Selecciones temporales** — Para pasar datos a modales de detalle se usa `tempSelectedElementStore`.

### Stores con Persistencia (localStorage)

| Store | Clave localStorage | Datos persistidos |
|:------|:-------------------|:------------------|
| `themeStore` | `theme-storage` | Tema activo |
| `configStore` | `config-storage` | Configuración del sistema, usuario, permisos, caja, tenant |

### Stores Utilitarios (sin dominio)

| Store | Archivo | Propósito |
|:------|:--------|:----------|
| `modalStorage` | `modalStorage.ts` | `openModal(id)` / `closeModal(id)` — Controla visibilidad de modales |
| `tempSelectedElementStore` | `tempSelectedElementStore.ts` | `setElement(id, data)` — Almacén temporal para pasar datos entre componentes |
| `stateStorage` | `stateStorage.ts` | `openLoading(id)` / `closeLoading(id)` — Estados de carga genéricos por ID |
| `toastMessageStore` | `toastMessageStore.ts` | `setMessage()` / `setError()` — Mensajes de notificación |

### IDs de Modales en Uso

```
contactAdd, contactDetails, deleteContact,
paymentPayableAdd, paymentReceivableAdd, creditNoteAdd,
cashDrawerOpen, cashDrawerDetails,
productDetails, productAdd,
paymentSuccess
```

### Mapa de Stores por Dominio

| Dominio | Store(s) | Archivo(s) |
|:--------|:---------|:-----------|
| Configuración | `configStore` | `configStore.ts` |
| Tema | `themeStore` | `themeStore.ts` |
| Dashboard | `dashboardStore` | `dashboardStore.ts` |
| Usuarios | `UserStore` | `UserStore.ts` |
| Contactos | `ContactStore` | `ContactStore.ts` |
| Productos | `productStore`, `productAddStore`, `productLinkedStore`, `productRemovedStore` | `products/*.ts` |
| Catálogos | `brandsStore`, `categoriesStore`, `LocationsStore`, `QuantityUnitStore` | `products/*.ts` |
| Pedidos | `ordersProductsStore` | `orders/ordersProductsStore.ts` |
| Caja | `cashAccountStore`, `cashExpensesStore`, `cashRemittancesStore`, `cashTransferStore` | `cash/*.ts` |
| Cajas registradoras | `cashdrawersStore`, `cutStore` | `cashdrawer/*.ts` |
| Cuentas | `accountReceivableStore`, `accountPayableStore` | `accounts/*.ts` |
| Configuración de créditos | `creditSettingsStore` (configuración y simulación del plan de cuotas) | `settings/creditSettingsStore.ts` |
| Herramientas | `adjustStore`, `quotesStore` | `tools/*.ts` |

---

## Hooks Personalizados — Patrones y Referencia

### Patrón General de un Hook de Lógica

Los hooks `use*Logic` encapsulan la lógica de negocio de cada módulo:

```typescript
// Patrón típico
const use[Modulo]Logic = () => {
  // 1. Suscripción al store
  const { datos, loading, error, loadDatos } = useMiStore();

  // 2. Hooks utilitarios
  const { page, perPage } = usePagination();
  const { searchTerm } = useSearchTerm();

  // 3. Carga de datos con useEffect
  useEffect(() => {
    const url = `recurso?sort=-created_at&perPage=${perPage}&page=${page}${searchTerm}`;
    loadDatos(url);
  }, [page, perPage, searchTerm]);

  // 4. Retorno de datos y funciones
  return { datos, loading, error };
};
```

### Categorías de Hooks

#### Hooks HTTP (`src/hooks/request/`)
| Hook | Descripción |
|:-----|:------------|
| `useGetRequest` | Peticiones GET con manejo de loading/error |
| `usePostRequest` | Peticiones POST con toast opcional |
| `usePutRequest` | Peticiones PUT |
| `useDownloadLink` | Descarga de archivos |

#### Hooks de UI
| Hook | Descripción |
|:-----|:------------|
| `usePagination` | Maneja parámetros de paginación por URL |
| `useSearchTerm` | Búsqueda con debounce de 300ms y construcción de filtros |
| `useToastMessage` | Integración con React Hot Toast |
| `useRelativeTime` | Formateo de timestamps relativos |

#### Hook de WebSocket
| Hook | Descripción |
|:-----|:------------|
| `useReverb` | Conexión con Laravel Reverb vía Pusher/Echo para actualizaciones en tiempo real |

#### Hooks de Configuración
| Hook | Descripción |
|:-----|:------------|
| `useConfigLogic` | Carga y extrae features activas del configStore |
| `useDashboardLogic` | Carga datos del dashboard (cards, gráficos) |

#### Hooks de Ubicación
| Hook | Descripción |
|:-----|:------------|
| `useCountries` | Obtiene lista de países |
| `useDepartaments` | Obtiene departamentos |
| `useTownByDepartaments` | Municipios por departamento |

### Mapa de Hooks por Dominio

| Dominio | Hooks | Cantidad |
|:--------|:------|:---------|
| Productos | `useProductsLogic`, `useProductNewLogic`, `useProductEditLogic`, `useProductDetailsLogic`, `useProductsSearchLogic`, `useProductRemoveLogic`, `useProductsLinkedLogic`, `useProductLinkedDetailsLogic`, `useLinkedProductsLogic`, `useSetLinksLogic`, `useProductCategoriesLogic`, `useLowStockLogic`, `useProductPricesEditLogic`, `useProductsExpiresLogic` | 14 |
| Inventario | `useKardexLogic`, `useKardexDetailLogic`, `useLotAssignLogic` | 3 |
| Pedidos | `useOrderProductsLogic`, `useOrderFnLogic`, `useOrderProductsSearchLogic`, `useOrderLoadersLogic` | 4 |
| Facturación | `useInvoicingLogic`, `useInvoicingElectronicLogic`, `useInvoiceTypesLogic`, `useInvoiceTypesElectronicLogic`, `useInvoicingCorrelativesLogic`, `useRemissionNoteLogic`, `useSearchDocumentLogic`, `useInvoiceDetailsLogic`, `useRecalculateYearsLogic`, `useInvoiceFnLogic` | 10 |
| Caja | `useCashAccountLogic`, `useCashExpensesLogic`, `useCashRemittancesLogic`, `useCashTransfersLogic`, `useCashHistoryLogic` | 5 |
| Cajas registradoras | `useCashDrawersLogic`, `useCutsLogic`, `useCutLogic` | 3 |
| Cuentas | `useAccountReceivableLogic`, `useAccountPayableLogic`, `useCreditPlanLogic`, `useAccountAgingLogic`, `useClientCreditLimitLogic` | 5 |
| Configuración | `useCreditSettingsLogic` (además de `useBranchesLogic`, `useChatbotLogic`, `useInvoicesLogic`, `useSettingsPermissionLogic`, `useUsersLogic`) | 6 |
| Contactos | `useContactsLogic`, `useContactsAddLogic`, `useContactSearchLogic` | 3 |
| Historial | `useHistorySalesLogic`, `useHistoryCostLogic` | 2 |
| Reportes | `useReportsLogic`, `useDownloadsLogic` | 2 |
| Herramientas | `useAjustmentLogic`, `useAjustmentModalLogic`, `useAjustmentProductsLogic`, `useQuotesLogic`, `useQuoteCheckLogic` | 5 |

---

## Capa de Servicios

### httpService (`src/services/httpService.ts`)

Instancia centralizada de Axios:

- **URL base**: Se construye desde la sesión de NextAuth (`session.url/api/v2`).
- **Interceptor de request**: Adjunta `Bearer ${session.accessToken}` a cada petición. Maneja `FormData` automáticamente.
- **Interceptor de response**: Registra errores 401 (expiración de sesión).
- **Métodos exportados**: `get`, `post`, `put`, `patch`, `del`.

### Wrappers CRUD (`src/services/services.ts`)

```typescript
getServices(url)            // GET genérico
createService(url, data)    // POST genérico
updateService(url, data)    // PUT genérico
deleteService(url)          // DELETE genérico
```

### Enumeraciones (`src/services/enums.ts`)

```typescript
enum PaymentType {
  efectivo = 1, tarjeta = 2, transferencia = 3,
  cheque = 4, credito = 5, btc = 6, otro = 0
}

enum DocumentTypes {
  ninguno = 0, ticket = 1, factura = 2, creditoFiscal = 3
}
```

---

## Interfaces de Datos Principales

Definidas en `src/interfaces/`:

| Interfaz | Archivo | Campos clave |
|:---------|:--------|:-------------|
| `User` | `user.ts` | id, name, email, status |
| `Product` | `products.ts` | id, cod, description, quantity, unit_cost, prices[], category?, brand?, location? |
| `Contact` | `contact.ts` | id, name, is_client?, is_provider?, is_employee?, phone?, email? |
| `Order` | `order.ts` | id, number, order_type, total, payment_type, products[], client, employee |
| `CashDrawer` | `cashdrawers.ts` | id, name, employee_id?, status |
| `Cut` | `Cuts.ts` | id, opening, close, sales_total, bills_total, cash_diference |
| `Category` | `category.ts` | id, name, pronoun, category_type, principal |
| `Brand` | `brand.ts` | id, name, provider_id |
| `Location` | `location.ts` | Almacén/ubicación |
| `Price` | `price.ts` | Nivel de precio del producto |
| `QuantityUnit` | `quantity_unit.ts` | Unidad de medida |
| `InvoiceProduct` | `Invoiceproduct.ts` | Línea de factura |
| `InvoiceAssigned` | `invoiceassigned.ts` | Asignación de factura |
| `CreditSettings`, `CreditPlan`, `CreditInstallment`, `CreditAging`, `ClientCreditSummary` | `credits.ts` | Configuración de créditos, plan simulado, cuota, cartera por antigüedad y límite del cliente |

---

## Utilidades (`src/lib/utils.ts`)

### Formateo de Moneda
- `numberToMoney(number, systemInfo?)` → `"$X.XX"`
- `numberToMoney4Digits(number, systemInfo?)` → `"$X.XXXX"`

### Permisos
- `permissionExists(permissions, permission)` → `boolean`

### Formateo de Documentos
- `formatDuiWithAll(cadena)` → `"XXXX-XXXXXX-XXX-X"`
- `formatDocument(cadena)` → Sin guiones
- `formatNumberPhone(num)` → `"XXXX-XXXX"`

### Tipos de Pago/Documento
- `getPaymentTypeName(type)` → Nombre del tipo de pago
- `documentType(document)` → Nombre del tipo de documento

### Búsquedas de Ubicación
- `getDepartmentNameById(id, data)`, `getMunicipioNameById(id, data)`
- `getCountryNameByCode(code, countries)`, `getMunicipiosByDepartamentoId(data, id)`

### Información del País
- `getCountryProperty(country)` → `{ name, currency, currencyName, document, taxes, taxesName }`

### Agregaciones de Arrays
- `getTotalOfItemWithStatus(datos, item, filter, status)` → Suma filtrada
- `getTotalOfItem(datos, item)` → Suma total
- `countItemsWithStatus(datos, filter, status)` → Conteo filtrado
- `getLastElement(items, row, status)` / `getFirstElement(items, row, status)`

### Matemáticas
- `percentage(totalCost, totalPrice)` → Porcentaje de margen
- `getTotalPercentage(porcentaje, total)` → Cálculo de porcentaje

---

## Construcción de URLs de API

Patrón estándar para construir URLs con filtros, includes, paginación y ordenamiento:

```typescript
`recurso?sort=${campo}&included=relacion1,relacion2&filterWhere[campo]==valor&perPage=${perPage}&page=${page}${searchTerm}`
```

**Ejemplos reales**:
```typescript
// Productos con relaciones y filtros
`products?sort=-cod&filterWhere[status]==1&included=prices,category&perPage=15&page=1&filter[description]=busqueda`

// Contactos ordenados
`contacts?sort=-created_at&included=employee&filterWhere[status]==1&perPage=10&page=1`

// Cajas registradoras activas
`cashdrawers?included=employee&filterWhere[status]=!0`
```

---

## Módulos Funcionales

| Módulo | Store principal | Hooks | Componentes clave |
|:-------|:----------------|:------|:-----------------|
| Dashboard | `dashboardStore` | 1 | PrincipalInfo, CharBarWeek, CharBarDay |
| Productos | `productStore` + 3 auxiliares | 14 | ProductsTable, ProductDetailsModal, ProductForms |
| Pedidos | `ordersProductsStore` | 4 | OrdersTable, OrderPaymentModal |
| Caja | 4 stores de caja | 5 | AccountsTable, ExpensesForm, RemittancesTable |
| Cuentas | AR/AP stores | 2 | AccountsTables, PaymentModals |
| Contactos | `ContactStore` | 3 | ContactsTable, ContactModals |
| Facturación | (usa productStore) | 10 | InvoicingTable, InvoiceDetailsModal |
| Cajas registradoras | `cashdrawersStore` | 3 | CashDrawerModal, CutDetailsModal |
| Reportes | (solo hooks) | 2 | ReportsTable |
| Herramientas | `adjustStore`, `quotesStore` | 5 | QuoteModals, AdjustmentModals |
