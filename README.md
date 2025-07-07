# Sistema de Filtrado de Productos - TheRefactorShop

Sistema de filtrado de productos implementado en TypeScript utilizando patrones Builder y Strategy. Permite filtrar por categoría, precio y stock con construcción fluida y criterios extensibles.

## 📐 Patrones de Diseño Implementados

### 1. Builder Pattern
- **ProductFilterBuilder**: Construcción fluida de filtros complejos
- **Métodos fluidos**: `withCategories()`, `withMinPrice()`, `withMaxPrice()`, `withInStockOnly()`, etc.
- **Flexibilidad**: Permite construir filtros paso a paso de manera intuitiva

### 2. Strategy Pattern
- **FilterCriterion**: Interface para estrategias de filtrado
- **Implementaciones**: `CategoryFilterCriterion`, `PriceFilterCriterion`, `StockFilterCriterion`
- **Cadena de responsabilidad**: Múltiples criterios aplicados en secuencia

## 🚀 Características

### Filtrado de Productos
- **Por categoría**: individual o múltiple
- **Por precio**: rango (min, max, o ambos)
- **Por stock**: productos disponibles o agotados
- **Combinado**: múltiples criterios simultáneamente

### Categorías Soportadas
- `food` - Productos alimenticios
- `clothes` - Ropa y accesorios
- `toiletries` - Productos de higiene
- `free-shipping` - Envío gratuito
- `new` - Productos nuevos
- `offer` - Ofertas especiales
- `limited-edition` - Edición limitada

### Funcionalidades Adicionales
- **Ordenamiento automático**: Productos con stock aparecen primero
- **Filtros vacíos**: Retorna todos los productos
- **Validación**: Manejo de casos límite y errores

## 🎯 Ejemplos de Uso

### 1. Filtrar productos de comida
```typescript
const foodFilter = new ProductFilter(['food']);
const foodProducts = productService.filterProducts(foodFilter);
```

### 2. Filtrar productos entre €1.00 y €10.00
```typescript
const priceFilter = ProductFilter.builder()
  .withPriceRange(1.00, 10.00)
  .build();
const priceRangeProducts = productService.filterProducts(priceFilter);
```

### 3. Filtrar comida barata (< €2.00)
```typescript
const combinedFilter = ProductFilter.builder()
  .withCategories(['food'])
  .withMaxPrice(2.00)
  .build();
const combinedResults = productService.filterProducts(combinedFilter);
```

### 4. Filtrar comida cara (> €50.00)
```typescript
const expensiveFoodFilter = ProductFilter.builder()
  .withCategories(['food'])
  .withMinPrice(50.00)
  .build();
const expensiveFood = productService.filterProducts(expensiveFoodFilter);
```

### 5. Sin filtro aplicado (todos los productos)
```typescript
const noFilter = new ProductFilter();
const allFilteredProducts = productService.filterProducts(noFilter);
```

## 🔧 Instalación y Ejecución

```bash
# Instalar dependencias
npm i

# Ejecutar tests
npm test

# Ejecutar demostración
npm run dev
```

## 🤔 Reflexión del código

### ¿Qué parte de tu código te gusta más y cuál menos?

**Lo que más me gusta:**
- **Patrón Builder**: La construcción dinámica de filtros con `ProductFilter.builder()`. Tan fácil cómo poner un `.` y esperar a que el intelisense te ayude
- **Patrón Strategy**: La separación de criterios en `FilterCriterion` hace que el código sea extensible y cada criterio tenga una responsabilidad única

**Lo que menos me gusta:**
- **Validación limitada**: No hay validación de categorías válidas, cualquier string se acepta como categoría
- **Mutación de arrays**: Aunque se corrigió (god bless chatgpt), inicialmente el `sort()` mutaba el array original
- **Falta de tipos más específicos**: Los precios y categorías podrían ser tipos más directos

### ¿Qué limitaciones y/o potenciales problemas piensas que puede tener tu código?

- **Persistencia**: Solo funciona en memoria, los datos se pierden al reiniciar, faltaría una base de datos
- **No hay validación**: No hay validación


### ¿Cómo implementar el filtro de stock?

**Pasos para implementar filtro de stock:**

1. **Extender ProductFilter**: Añadir propiedad `hasStock` al constructor
2. **Actualizar Builder**: Agregar método `withStockFilter(boolean)`
3. **Crear StockFilterCriterion**: Implementar la lógica de filtrado por stock
4. **Integrar en ProductFilter**: Añadir el criterio a la cadena de filtros
5. **Escribir tests**: Validar el comportamiento del nuevo filtro
6. **Documentar**: Actualizar ejemplos de `main.ts` y documentación del readme