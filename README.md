# Sistema de Filtrado de Productos - TheRefactorShop

Sistema de filtrado de productos.

## 📐 Patrones de Diseño Implementados

### 1. Builder Pattern
- **ProductFilterBuilder**: Construcción fluida de filtros complejos
- **Métodos fluidos**: `withCategories()`, `withMinPrice()`, `withMaxPrice()`, `withInStockOnly()`, etc.
- **Flexibilidad**: Permite construir filtros paso a paso de manera intuitiva

### 2. Chain/Strategy Pattern
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