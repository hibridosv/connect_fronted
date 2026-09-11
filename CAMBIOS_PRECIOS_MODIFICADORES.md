# Cambios: precio de opciones/variantes de modificadores (temporal)

> Documento temporal. Describe los cambios hechos en `pulse` (Next.js) y cómo portarlos a
> `connect-app` (React Native / Expo).

## Resumen de cambios en `pulse`

### 1. `src/components/restaurant/OptionsVariantsModal.tsx`
Modal de administración de variantes de un modificador (menú de restaurante). Se agregó el precio
de cada variante en letra pequeña y tenue, debajo del nombre.

- Import: `numberToMoney` de `@/lib/utils`, `useConfigStore` de `@/stores/configStore`.
- `const { system } = useConfigStore();`
- En `listVariants`, el nombre pasó de `<span>{variant?.name}</span>` a un `<div className="flex flex-col">`
  con el nombre y un `<span className="text-xs text-text-muted">{numberToMoney(variant?.price, system)}</span>`.

### 2. `src/components/orders/utils.ts`
Nueva función utilitaria:

```ts
export const sumarOptionsTotal = (datos: any): number => {
  let totalSuma = 0;
  datos?.forEach((elemento: any) => {
    elemento?.options?.forEach((option: any) => {
      totalSuma += option?.option?.price ?? 0;
    });
  });
  return totalSuma;
}
```

Recorre `invoiceproducts[].options[].option.price` y los suma todos (estructura real: ver
`src/interfaces/order.json`, cada `invoiceproduct.options[i].option.price`).

### 3. `src/components/orders/restaurant/RestaurantShowTotal.tsx`
Muestra el total de extras (modificadores con precio) y lo suma al total de la orden. Este
componente es compartido por la orden normal (`/orders/restaurant`) y por **order split**
(`/orders/restaurant/split`), así que el cambio aplica a ambos sin tocar el split.

- Import `sumarOptionsTotal`.
- `const extras: number = sumarOptionsTotal(order?.invoiceproducts);`
- `const total: number = calculateOrderTotal(order) + extras;` (antes no sumaba `extras`).
- Nueva fila "Extras" (solo si `extras > 0`), con el mismo estilo que la fila de Descuento,
  ubicada entre Descuento y Propina.
- La propina y el total final ya quedan calculados sobre el `total` con extras incluidos, sin
  tocar más lógica.

### 4. `src/components/orders/restaurant/ProductOptionsModal.tsx`
Modal bloqueante donde el mesero elige la opción de un grupo de modificadores (ej. "Cocida",
"Tortilla"). Se agregó un badge sutil con el precio sobre el ícono, solo si `price > 0`:

```tsx
<div className="relative">
  <Image loader={imageLoader} src={record?.option?.image} alt="Icono" width={96} height={96} className="rounded-t-md" />
  {record?.option?.price > 0 && (
    <span className="absolute top-1 right-1 bg-black/50 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
      +{numberToMoney(record.option.price, system)}
    </span>
  )}
</div>
```

Requiere `numberToMoney` y `system` (de `useConfigStore`).

### 5. `src/components/orders/restaurant/GroupedOptionsProductsModal.tsx`
Modal de solo lectura que agrupa las líneas de un mismo producto y lista sus opciones ya
elegidas. Se agregó el precio junto al nombre, en texto pequeño y tenue:

```tsx
<span>{option?.option?.name}</span>
{option?.option?.price > 0 && (
  <span className="ml-1.5 text-xs text-text-muted/70">
    (+{numberToMoney(option.option.price, system)})
  </span>
)}
```

Requiere `numberToMoney` y `system`.

---

## Cómo portarlo a `connect-app` (React Native / Expo)

Los archivos equivalentes ya existen como "puerto" de estos mismos componentes de `pulse`
(comentario `// Puerto de pulse/...` en cada uno). Ruta base: `connect-app/src/components/`.

### `restaurant/OptionsVariantsModal.tsx`
**Ya muestra el precio** (`variantPrice` con `numberToMoney(variant?.price ?? 0, system)`). No
requiere cambios.

### `orders/utils.ts`
Agregar la misma función que en `pulse` (el archivo es un puerto parcial, solo tiene lo que usa
Comercio; agregar `sumarOptionsTotal` igual):

```ts
export const sumarOptionsTotal = (datos: any): number => {
  let totalSuma = 0;
  datos?.forEach((el: any) => {
    el?.options?.forEach((option: any) => {
      totalSuma += option?.option?.price ?? 0;
    });
  });
  return totalSuma;
};
```

### `orders/restaurant/RestaurantShowTotal.tsx`
Mismo patrón que en `pulse`, adaptado a RN/`ThemedText`:

1. Importar `sumarOptionsTotal` desde `../utils`.
2. `const extras = sumarOptionsTotal(order?.invoiceproducts);`
3. `const total = calculateOrderTotal(order) + extras;`
4. Insertar una fila "Extras" entre la de Descuento y la de Propina, condicionada a
   `extras > 0`, reutilizando el estilo `styles.row` + `styles.rowBorder` (igual a la fila de
   Descuento pero sin color condicional):

```tsx
{extras > 0 && (
  <View style={[styles.row, styles.rowBorder, { borderColor: theme.border }]}>
    <ThemedText themeColor="textSecondary" style={styles.label}>Extras</ThemedText>
    <ThemedText style={styles.value}>{numberToMoney(extras, system)}</ThemedText>
  </View>
)}
```

### `orders/restaurant/ProductOptionsModal.tsx` + `orders/restaurant/MenuTile.tsx`
`ProductOptionsModal` usa `<MenuTile>` para cada opción, y `MenuTile` es un componente genérico
compartido (categorías, productos del menú, etc.), así que el precio debe ser un prop **opcional**
para no afectar los demás usos:

1. En `MenuTile.tsx`, agregar prop opcional `priceLabel?: string` a `MenuTileProps`, y renderizar
   un badge absoluto sobre `imageWrap` (mismo lugar que `categoryBadge`) solo si viene definido:

```tsx
{priceLabel && (
  <View style={[styles.priceBadge, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
    <ThemedText style={styles.priceBadgeText} lightColor="#fff" darkColor="#fff">
      {priceLabel}
    </ThemedText>
  </View>
)}
```

   con estilos análogos a `categoryBadge` pero `paddingHorizontal: 6`, `borderRadius: 10`,
   posicionado `top: 6, right: 6` (o `left: 6` si choca con `categoryBadge`, aunque en este modal
   `isCategory` nunca es `true`).

2. En `ProductOptionsModal.tsx`, pasar el precio formateado:

```tsx
<MenuTile
  key={record.id}
  index={index}
  label={record?.option?.name ?? ''}
  imageSrc={record?.option?.image}
  priceLabel={record?.option?.price > 0 ? `+${numberToMoney(record.option.price, system)}` : undefined}
  onPress={() => handleUpdate({ id: record.id, iden: record.iden })}
/>
```

   Requiere agregar `numberToMoney` (`@/lib/utils`) y `system` (`useConfigStore`) a este archivo,
   que actualmente no los usa.

### `orders/restaurant/GroupedOptionsProductsModal.tsx`
Mismo patrón que en `pulse`: agregar el precio junto al nombre de la opción, en un `ThemedText`
más pequeño y con color secundario/atenuado:

```tsx
<ThemedText themeColor="textSecondary" style={styles.optionName}>
  {option?.option?.name}
</ThemedText>
{option?.option?.price > 0 && (
  <ThemedText themeColor="textSecondary" style={[styles.optionName, { opacity: 0.7 }]}>
    (+{numberToMoney(option.option.price, system)})
  </ThemedText>
)}
```

Requiere importar `numberToMoney` y `system` (`useConfigStore`), que actualmente no se usan en
este archivo.

---

## Checklist para portar a connect-app

- [ ] `src/components/orders/utils.ts` — agregar `sumarOptionsTotal`
- [ ] `src/components/orders/restaurant/RestaurantShowTotal.tsx` — fila "Extras" + sumar al total
- [ ] `src/components/orders/restaurant/MenuTile.tsx` — prop opcional `priceLabel` + badge
- [ ] `src/components/orders/restaurant/ProductOptionsModal.tsx` — pasar `priceLabel` a `MenuTile`
- [ ] `src/components/orders/restaurant/GroupedOptionsProductsModal.tsx` — precio junto al nombre
- [x] `src/components/restaurant/OptionsVariantsModal.tsx` — ya lo tiene, sin cambios
