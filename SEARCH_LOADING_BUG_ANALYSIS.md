# Análisis: buscadores que se quedan "cargando" y no mandan peticiones nuevas

Investigación del reporte: los componentes de `src/components/search` (y variantes en
`orders/`, `modal/`) a veces se quedan pegados en estado de carga, o no disparan una
nueva petición al teclear.

Flujo revisado: `SearchInput` → `useSearchTerm` → `use*SearchLogic` → store (Zustand)
→ `httpService` (axios).

No se modificó código, esto es solo diagnóstico para abordar después.

---

## Causa principal 1 — el guard de deduplicación no se resetea al borrar el input

Archivos con el mismo patrón repetido:

- `src/hooks/products/useProductsSearchLogic.ts:10-16`
- `src/hooks/search/useContactSearchLogic.ts:10-16`
- `src/hooks/order/common/useOrderProductsSearchLogic.ts:10-16`
- `src/hooks/useProductsSearchModalLogic.ts:9-14`
- `src/hooks/products/useProductsLogic.ts:10-18` (usado en `products/search`, mismo patrón)

```ts
const [searchTermNew, setSearchTermNew] = useState("");
useEffect(() => {
  if ((searchTerm != searchTermNew || sortBy != sortByNew) && searchTerm != "") {
    setSearchTermNew(searchTerm);
    loadProducts(url) // o loadContacts
  }
}, [...])
```

`searchTermNew` guarda el último término que disparó una petición, pero **nunca se
resetea** cuando `searchTerm` vuelve a `""` (usuario borra el input). El `if` exige
`searchTerm != ""`, así que ese bloque nunca toca `searchTermNew` al limpiar.

**Repro:** buscar "coca" → seleccionar resultado (limpia el input) → volver a buscar
"coca" otra vez (común en POS: agregar el mismo producto dos veces). El `searchTerm`
calculado es idéntico al que ya estaba en `searchTermNew` → la condición da `false` →
**no se dispara ninguna petición**. El dropdown queda vacío/desactualizado.

Esto explica el "a veces": solo ocurre con términos repetidos, no con términos nuevos.

---

## Causa principal 2 — `loading` es un booleano global compartido, no por-instancia

- `src/stores/products/productStore.ts:13` — un solo `loading` compartido por
  `loadProducts` (35-46), `loadProduct` (48-59), `loadKardex` (97-108),
  `loadKardexDetails` (110-121). (`loadStatistics` tiene su propio `loadingStat`,
  pero las demás no están aisladas.)
- `src/stores/ContactStore.ts:12` — mismo patrón, `loading` compartido en el store.

Componentes de búsqueda leen ese `loading` global para el spinner:
`ProductsSearch.tsx:25`, `OrderProductsSearch.tsx:19,42`,
`SearchProductModal.tsx:23,41`.

**Problema:** si en la misma página/árbol hay otra parte de la UI que también usa
`useProductStore` (edición de producto, kardex, modal de detalle, etc.), su petición
pone `loading: true` y enciende el spinner del buscador aunque su propia búsqueda ya
haya terminado. Si esa otra petición se cuelga o tarda mucho, el spinner del buscador
**queda pegado en "cargando" indefinidamente**, sin relación con lo que se está
tecleando.

Además, ninguna acción de los stores usa `AbortController` ni compara un
id/secuencia de petición contra la más reciente (`productStore.ts`, `ContactStore.ts`,
`useGetRequest.ts:12-24`). Si dos requests quedan en vuelo (típico al escribir
rápido) y la respuesta más vieja llega **después** de la más nueva, esa respuesta
vieja pisa el estado (`products`, `loading`) con datos obsoletos.

---

## Causa secundaria — instancias múltiples comparten el mismo store global

`ClientsSearch.tsx` y `ContactSearch.tsx` leen/escriben el mismo `useContactStore`
(`contacts`, `loading`) sin namespacing por instancia. Cualquier página con dos
buscadores de contacto simultáneos (o cualquier otra parte de la app que dispare
`loadContacts` mientras el buscador está activo) hace que ambos compitan por el mismo
`contacts`/`loading` — escribir en uno puede "contestar" en el otro, o dejar el otro
colgado si su propia respuesta nunca llega mientras la del otro sí.

---

## Hallazgo menor (no bloqueante, pero relevante)

`src/stores/sessionStore.ts:10-13` — `sessionChecked` es una promesa de módulo que se
resuelve **una sola vez**, en el primer login/carga de la app. El interceptor en
`src/services/httpService.ts:20-22` hace `await sessionChecked` si no hay
`accessToken`, pero como esa promesa queda resuelta para siempre después del primer
arranque, ese `await` es un no-op en cualquier momento posterior — no protege contra
una ventana real de refresh de token a mitad de sesión (en ese caso la petición sale
sin `Authorization` y probablemente cae en 401, no se queda colgada).

Solo podría causar un cuelgue real si la *primera* búsqueda de toda la sesión ocurre
antes de que `useSession()` deje el estado `loading`. Caso de borde, no explica la
recurrencia del "a veces".

---

## Otro detalle observado (no confirmado como causante directo)

`ContactSearch.tsx:34` — `const { setElement, getElement, clearElement } =
useTempStorage();` suscribe el componente al store completo sin selector, por lo que
re-renderiza ante **cualquier** cambio de `elements` en cualquier parte de la app
(cualquier `setElement`/`clearElement`, de cualquier clave). No es un loop infinito,
pero es re-render innecesario y puede sumar jank en páginas con mucha actividad
(ej. orders), contribuyendo a la sensación de "se traba".

---

## Orden de probabilidad de ser la causa reportada

1. **Guard `searchTermNew` que no se resetea** — el más determinista y fácil de
   reproducir (buscar el mismo término dos veces).
2. **`loading` global compartido entre acciones/instancias del mismo store** —
   explica el "se queda cargando" persistente en páginas con más de un consumidor
   del store.
3. **Sin cancelación/orden de respuestas (`AbortController`)** — explica resultados
   inconsistentes al escribir rápido.
4. **Contact store compartido** entre múltiples `ClientsSearch`/`ContactSearch` en la
   misma página.

---

## Posibles direcciones de fix (pendiente de decidir, no implementado)

- En los hooks `use*SearchLogic`: resetear `searchTermNew` cuando `searchTerm ===
  ""`, o mejor, no usar un guard basado en "cambió el string" sino disparar siempre
  que cambie `debouncedValue` real (dejar que `useSearchTerm`/debounce sea la única
  fuente de deduplicación).
- Aislar el `loading` por tipo de operación en los stores (`loadingProducts`,
  `loadingProduct`, `loadingKardex`, etc. en vez de un único `loading`), o mover la
  búsqueda a un store/hook propio no compartido con el resto del CRUD de productos.
- Agregar `AbortController` (o un id de petición incremental) en `loadProducts` /
  `loadContacts` / `useGetRequest` para descartar respuestas obsoletas.
- Evaluar si `ClientsSearch`/`ContactSearch` necesitan su propio slice de estado por
  instancia en vez de depender de un store singleton compartido.
