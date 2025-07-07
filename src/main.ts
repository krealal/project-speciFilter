import { ProductService } from './ProductService';
import { Product } from './Product';
import { ProductFilter } from './ProductFilter';

async function main() {
  console.log('🏪 Sistema de Filtrado de Productos - TheRefactorShop');
  console.log('📐 Patrones utilizados: Builder + Chain/Strategy');
  console.log('='.repeat(55));

  const products = [
    new Product('3', 'Apple', 0.99, ['food', 'free-shipping'], true),
    new Product('1', 'Banana', 1.50, ['food'], false),
    new Product('2', 'T-Shirt', 15.99, ['clothes', 'new'], true),
    new Product('4', 'Shampoo', 8.50, ['toiletries', 'offer'], true),
    new Product('5', 'Limited Watch', 299.99, ['limited-edition'], false)
  ];

  const productService = new ProductService(products);

  console.log('\n📦 Catálogo de productos disponibles:');
  const allProducts = productService.getAllProducts();
  allProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅ En stock' : '❌ Sin stock';
    const categories = product.categories.join(', ');
    console.log(`  ${product.name} - €${product.price} [${categories}] ${stockStatus}`);
  });

  console.log('\n🔍 Ejemplos de filtrado:');
  console.log('-'.repeat(30));

  // Ejemplo 1: Filtrar por categoría usando constructor directo
  console.log('\n1️⃣ Filtrar productos de comida (Constructor directo):');
  const foodFilter = new ProductFilter(['food']);
  const foodProducts = productService.filterProducts(foodFilter);
  foodProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price}`);
  });

  // Ejemplo 2: Filtrar por precio usando Builder pattern
  console.log('\n2️⃣ Filtrar productos entre €1.00 y €10.00 (Builder Pattern):');
  const priceFilter = ProductFilter.builder()
    .withPriceRange(1.00, 10.00)
    .build();
  const priceRangeProducts = productService.filterProducts(priceFilter);
  priceRangeProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price}`);
  });

  // Ejemplo 3: Combinar múltiples criterios usando Builder
  console.log('\n3️⃣ Filtrar comida barata (< €2.00) usando Builder:');
  const combinedFilter = ProductFilter.builder()
    .withCategories(['food'])
    .withMaxPrice(2.00)
    .build();
  const combinedResults = productService.filterProducts(combinedFilter);
  combinedResults.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price}`);
  });

  // Ejemplo 4: Filtro que no coincide con nada
  console.log('\n4️⃣ Filtrar comida cara (> €50.00):');
  const expensiveFoodFilter = ProductFilter.builder()
    .withCategories(['food'])
    .withMinPrice(50.00)
    .build();
  const expensiveFood = productService.filterProducts(expensiveFoodFilter);
  if (expensiveFood.length === 0) {
    console.log('  📭 No se encontraron productos que coincidan con el filtro');
  }

  // Ejemplo 5: Sin filtro aplicado
  console.log('\n5️⃣ Sin filtro aplicado (todos los productos):');
  const noFilter = new ProductFilter();
  const allFilteredProducts = productService.filterProducts(noFilter);
  console.log(`  📋 Total de productos: ${allFilteredProducts.length}`);
  console.log('  🏆 Productos con stock aparecen primero:');
  allFilteredProducts.forEach((product, index) => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`    ${index + 1}. ${stockStatus} ${product.name}`);
  });

  // Ejemplo 6: Demostrar Builder pattern con métodos fluidos
  console.log('\n6️⃣ Builder pattern con métodos fluidos:');
  const builderFilter = ProductFilter.builder()
    .withCategories(['clothes', 'toiletries'])
    .withMinPrice(5.00)
    .build();
  const builderResults = productService.filterProducts(builderFilter);
  builderResults.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    const categories = product.categories.join(', ');
    console.log(`  ${stockStatus} ${product.name} - €${product.price} [${categories}]`);
  });

  // Ejemplo 7: Filtro de stock usando Builder
  console.log('\n7️⃣ Filtrar solo productos en stock (Builder):');
  const inStockFilter = ProductFilter.builder()
    .withInStockOnly()
    .build();
  const inStockProducts = productService.filterProducts(inStockFilter);
  inStockProducts.forEach(product => {
    const categories = product.categories.join(', ');
    console.log(`  ✅ ${product.name} - €${product.price} [${categories}]`);
  });

  // Ejemplo 8: Combinación compleja usando Builder
  console.log('\n8️⃣ Filtrar comida en stock (Builder + Chain):');
  const foodInStockFilter = ProductFilter.builder()
    .withCategories(['food'])
    .withInStockOnly()
    .build();
  const foodInStockProducts = productService.filterProducts(foodInStockFilter);
  foodInStockProducts.forEach(product => {
    console.log(`  ✅ ${product.name} - €${product.price}`);
  });

  // Ejemplo 9: Builder con múltiples categorías
  console.log('\n9️⃣ Builder añadiendo categorías una por una:');
  const multiCategoryFilter = ProductFilter.builder()
    .withCategory('food')
    .withCategory('clothes')
    .build();
  const multiCategoryProducts = productService.filterProducts(multiCategoryFilter);
  multiCategoryProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    const categories = product.categories.join(', ');
    console.log(`  ${stockStatus} ${product.name} - €${product.price} [${categories}]`);
  });

  console.log('\n🎯 Patrones implementados:');
  console.log('  📐 Builder Pattern:');
  console.log('    • ProductFilterBuilder con métodos fluidos');
  console.log('    • Construcción paso a paso de filtros complejos');
  console.log('    • Métodos withCategories(), withPrice(), withStock()');
  console.log('  🔗 Chain/Strategy Pattern:');
  console.log('    • FilterCriterion interface para estrategias');
  console.log('    • CategoryFilterCriterion, PriceFilterCriterion, StockFilterCriterion');
  console.log('    • Cadena de criterios aplicados en ProductFilter.matches()');
  console.log('  ✨ Características:');
  console.log('    • Filtrado por categoría individual o múltiple');
  console.log('    • Filtrado por rango de precios');
  console.log('    • Filtrado por disponibilidad de stock');
  console.log('    • Ordenamiento automático: productos con stock primero');
  console.log('    • Arquitectura simple sin capas DDD');
}

if (require.main === module) {
  main().catch(console.error);
}

export { main }; 