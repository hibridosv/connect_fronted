# Plan: Consolidar layouts duplicados bajo un route group `(app)`

## Problema

17 de los 20 archivos `layout.tsx` bajo `src/app/*` son **copias idénticas** del mismo código:

```tsx
'use client'
import { LoadingPage } from "@/components/LoadingPage";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-full">
        <Suspense fallback={<LoadingPage />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default Layout;
```

Presente en: `accounts`, `annexes`, `cash`, `cashdrawers`, `contacts`, `dashboard`, `help`, `history`, `invoicing`, `maintenance`, `orders`, `products`, `reports`, `restaurant`, `settings`, `tools`, `transfers`.

Como cada uno es un segmento de ruta independiente (no comparten un layout padre común aparte del `RootLayout`), Next.js **desmonta y vuelve a montar todo el árbol del Navbar** cada vez que el usuario navega entre módulos (ej. Dashboard → Productos). Efectos medibles:

- `useReverb` hace `channel.leave()` y se re-suscribe al canal de Pusher/Reverb en cada navegación (`src/hooks/useReverb.ts`).
- `useNotificationsLogic` vuelve a pedir notificaciones al backend en cada navegación.
- Se ve el fallback de `<Suspense>` (`LoadingPage`) en cada cambio de sección — parpadeo de carga.
- Costo de reconciliación de React (unmount + mount completo) en cada clic del menú.

**Fuera del problema** (no tocar):
- `src/app/payments/layout.tsx` usa `<NavbarPayments />`, no `<Navbar />` — es intencionalmente distinto.
- `src/app/contacts/search/layout.tsx` y `src/app/products/search/layout.tsx` son layouts anidados que solo agregan un `<Suspense>` extra dentro de su módulo padre — no duplican el Navbar, se quedan igual.
- `src/app/protected`, `src/app/protected-ssr`, `src/app/redirects`, `src/app/api`, `src/app/page.tsx` (login) no tienen layout con Navbar hoy — no se agregan al grupo.

## Solución

Usar un **route group** de Next.js App Router: una carpeta `(app)` cuyo nombre entre paréntesis no agrega segmento a la URL, pero permite que todas las rutas dentro compartan un único layout persistente.

### Estructura objetivo

```
src/app/
├── layout.tsx                  # Root layout (sin cambios: Providers, html/body)
├── page.tsx                    # Login (sin cambios, fuera del grupo)
├── api/                        # Sin cambios
├── protected/, protected-ssr/, redirects/   # Sin cambios
├── payments/                   # Sin cambios (layout propio con NavbarPayments)
└── (app)/
    ├── layout.tsx              # ÚNICO Navbar + Suspense, montado una sola vez
    ├── accounts/
    ├── annexes/
    ├── cash/
    ├── cashdrawers/
    ├── contacts/
    │   └── search/             # conserva su layout.tsx propio (Suspense anidado)
    ├── dashboard/
    ├── help/
    ├── history/
    ├── invoicing/
    ├── maintenance/
    ├── orders/
    ├── products/
    │   └── search/             # conserva su layout.tsx propio (Suspense anidado)
    ├── reports/
    ├── restaurant/
    ├── settings/
    ├── tools/
    └── transfers/
```

Las URLs finales **no cambian** (`/dashboard`, `/products`, etc.) porque `(app)` no es un segmento de ruta real. El middleware (`src/middleware.ts`) no necesita modificarse: su `matcher` trabaja sobre paths (`/dashboard/:path*`, etc.), no sobre la estructura de carpetas.

## Pasos de migración

### 1. Crear el layout único del grupo

Crear `src/app/(app)/layout.tsx` con el contenido que hoy está duplicado (Navbar + Suspense), tal cual, sin cambios de comportamiento:

```tsx
'use client'

import { LoadingPage } from "@/components/LoadingPage";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="w-full h-full">
        <Suspense fallback={<LoadingPage />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default AppLayout;
```

### 2. Mover los 17 módulos dentro de `(app)/`

Usar `git mv` (preserva historial) para cada carpeta:

```bash
mkdir -p "src/app/(app)"
git mv src/app/accounts     "src/app/(app)/accounts"
git mv src/app/annexes      "src/app/(app)/annexes"
git mv src/app/cash         "src/app/(app)/cash"
git mv src/app/cashdrawers  "src/app/(app)/cashdrawers"
git mv src/app/contacts     "src/app/(app)/contacts"
git mv src/app/dashboard    "src/app/(app)/dashboard"
git mv src/app/help         "src/app/(app)/help"
git mv src/app/history      "src/app/(app)/history"
git mv src/app/invoicing    "src/app/(app)/invoicing"
git mv src/app/maintenance  "src/app/(app)/maintenance"
git mv src/app/orders       "src/app/(app)/orders"
git mv src/app/products     "src/app/(app)/products"
git mv src/app/reports      "src/app/(app)/reports"
git mv src/app/restaurant   "src/app/(app)/restaurant"
git mv src/app/settings     "src/app/(app)/settings"
git mv src/app/tools        "src/app/(app)/tools"
git mv src/app/transfers    "src/app/(app)/transfers"
```

`contacts/search/layout.tsx` y `products/search/layout.tsx` viajan junto con sus carpetas padre sin tocarlos.

### 3. Borrar los 17 `layout.tsx` duplicados

Después del `git mv`, cada módulo movido conserva su viejo `layout.tsx` (el que tenía Navbar duplicado). Eliminarlos, porque ahora el Navbar lo pone `(app)/layout.tsx`:

```bash
rm "src/app/(app)/accounts/layout.tsx"
rm "src/app/(app)/annexes/layout.tsx"
rm "src/app/(app)/cash/layout.tsx"
rm "src/app/(app)/cashdrawers/layout.tsx"
rm "src/app/(app)/contacts/layout.tsx"
rm "src/app/(app)/dashboard/layout.tsx"
rm "src/app/(app)/help/layout.tsx"
rm "src/app/(app)/history/layout.tsx"
rm "src/app/(app)/invoicing/layout.tsx"
rm "src/app/(app)/maintenance/layout.tsx"
rm "src/app/(app)/orders/layout.tsx"
rm "src/app/(app)/products/layout.tsx"
rm "src/app/(app)/reports/layout.tsx"
rm "src/app/(app)/restaurant/layout.tsx"
rm "src/app/(app)/settings/layout.tsx"
rm "src/app/(app)/tools/layout.tsx"
rm "src/app/(app)/transfers/layout.tsx"
```

No tocar `(app)/contacts/search/layout.tsx` ni `(app)/products/search/layout.tsx` — esos son layouts anidados legítimos, distintos del problema.

### 4. Verificar imports relativos

Se revisó el código y solo existe **un** import relativo cruzando el límite de carpeta dentro de los módulos movidos: `src/app/settings/permissions/page.tsx` usa `import { canViewRole } from "../utils"`, que apunta a `settings/utils` (un archivo hermano dentro del mismo módulo `settings/`). Como `settings/` se mueve completo como unidad, esa ruta relativa **sigue siendo válida** sin cambios. Todos los demás imports usan el alias `@/*`, que Next.js resuelve por `tsconfig.json` (`baseUrl`/`paths`), no por posición en el árbol de carpetas — no se ven afectados por el `git mv`.

### 5. Revisar referencias a rutas por string

Buscar cualquier `href`, `router.push`, `redirect()` o similar que apunte a paths tipo `/dashboard`, `/products`, etc. — **no deberían necesitar cambios** porque las URLs no cambian, pero es la validación de sanidad antes de dar por cerrado el punto:

```bash
grep -rE "['\"]/(dashboard|products|orders|cash|accounts|contacts|invoicing|reports|settings|tools|transfers|history|cashdrawers|annexes|maintenance|restaurant|help)" src --include="*.tsx" --include="*.ts"
```

Confirmar que ninguno depende de la estructura física de carpetas (Next.js resuelve por URL, no por path de archivo, así que en teoría no hay riesgo).

## Verificación

1. `npm run build` — debe compilar sin errores de resolución de módulos.
2. `npm run dev` y navegar manualmente:
   - Login → Dashboard → Productos → Pedidos → Caja → Cuentas, confirmando que el Navbar **no parpadea** ni se recarga entre esos saltos (antes sí lo hacía).
   - Abrir DevTools → React DevTools → Components, confirmar que `Navbar` no aparece/desaparece del árbol al cambiar de sección (debe permanecer montado).
   - Con el panel de Network abierto, confirmar que no se repite la petición de notificaciones ni la reconexión del websocket de Reverb en cada navegación entre módulos.
   - Probar `/products/search` y `/contacts/search` para confirmar que su `Suspense` anidado sigue funcionando.
   - Probar `/payments` para confirmar que sigue usando `NavbarPayments` sin cambios.
   - Probar los redirects de tenant (`/redirects/suspended`, etc.) y `/protected`, `/protected-ssr` sin cambios.
3. `npm run lint`.

## Rollback

Todo el cambio es de movimiento de archivos + un layout nuevo + borrado de 17 archivos triviales. Si algo falla, revertir el commit es directo (`git revert` o `git reset` sobre la rama de trabajo, nunca sobre `main`/`developer` compartidas sin coordinar).

## Fuera de alcance (seguimiento futuro)

Este plan resuelve únicamente el remount del Navbar entre navegaciones. Otras causas de lentitud detectadas en la investigación previa, para abordar por separado:

- Falta de cache de datos en cliente (sin SWR/react-query ni store tipo `catalogCacheStore` como en `connect-app`).
- Alto porcentaje de Client Components (341/438 `.tsx` con `'use client'`) sin aprovechar Server Components.
- Espera de `sessionChecked` (round-trip a `/api/auth/session` de NextAuth) antes de la primera petición autenticada.
