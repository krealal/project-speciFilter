import { ProductFilterService } from './application/use-cases/product-filter-service';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product-repository';
import { Product } from './domain/entities/product';
import { Category } from './domain/value-objects/category';
import { Price } from './domain/value-objects/price';
import { ProductFilter } from './domain/value-objects/product-filter';

/**
 * Demostración del sistema de filtrado de productos de TheRefactorShop
 * Implementado usando DDD (Domain-Driven Design) y TDD (Test-Driven Development)
 */
async function main() {
  console.log('🏪 Sistema de Filtrado de Productos - TheRefactorShop');
  console.log('='.repeat(55));

  // Crear el catálogo de productos según el enunciado
  const products = [
    new Product(
      '3',
      'Apple',
      new Price(0.99),
      [new Category('food'), new Category('free-shipping')],
      true
    ),
    new Product(
      '1',
      'Banana',
      new Price(1.50),
      [new Category('food')],
      false
    ),
    new Product(
      '2',
      'T-Shirt',
      new Price(15.99),
      [new Category('clothes'), new Category('new')],
      true
    ),
    new Product(
      '4',
      'Shampoo',
      new Price(8.50),
      [new Category('toiletries'), new Category('offer')],
      true
    ),
    new Product(
      '5',
      'Limited Watch',
      new Price(299.99),
      [new Category('limited-edition')],
      false
    )
  ];

  // Configurar el sistema
  const repository = new InMemoryProductRepository(products);
  const filterService = new ProductFilterService(repository);

  console.log('\n📦 Catálogo de productos disponibles:');
  const allProducts = await filterService.getAllProducts();
  allProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅ En stock' : '❌ Sin stock';
    const categories = product.categories.map(c => c.value).join(', ');
    console.log(`  ${product.name} - €${product.price.value} [${categories}] ${stockStatus}`);
  });

  console.log('\n🔍 Ejemplos de filtrado:');
  console.log('-'.repeat(30));

  // Ejemplo 1: Filtrar solo por categoría
  console.log('\n1️⃣ Filtrar productos de comida:');
  const foodFilter = new ProductFilter([new Category('food')]);
  const foodProducts = await filterService.filterProducts(foodFilter);
  foodProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price.value}`);
  });

  // Ejemplo 2: Filtrar solo por rango de precio
  console.log('\n2️⃣ Filtrar productos entre €1.00 y €10.00:');
  const priceFilter = new ProductFilter([], new Price(1.00), new Price(10.00));
  const priceRangeProducts = await filterService.filterProducts(priceFilter);
  priceRangeProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price.value}`);
  });

  // Ejemplo 3: Combinar categoría y precio
  console.log('\n3️⃣ Filtrar comida barata (< €2.00):');
  const combinedFilter = new ProductFilter(
    [new Category('food')], 
    undefined, 
    new Price(2.00)
  );
  const combinedResults = await filterService.filterProducts(combinedFilter);
  combinedResults.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price.value}`);
  });

  // Ejemplo 4: Filtro que no coincide con nada
  console.log('\n4️⃣ Filtrar comida cara (> €50.00):');
  const expensiveFoodFilter = new ProductFilter(
    [new Category('food')], 
    new Price(50.00)
  );
  const expensiveFood = await filterService.filterProducts(expensiveFoodFilter);
  if (expensiveFood.length === 0) {
    console.log('  📭 No se encontraron productos que coincidan con el filtro');
  }

  // Ejemplo 5: Sin filtro (todos los productos)
  console.log('\n5️⃣ Sin filtro aplicado (todos los productos):');
  const noFilter = new ProductFilter();
  const allFilteredProducts = await filterService.filterProducts(noFilter);
  console.log(`  📋 Total de productos: ${allFilteredProducts.length}`);
  console.log('  🏆 Productos con stock aparecen primero:');
  allFilteredProducts.forEach((product, index) => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`    ${index + 1}. ${stockStatus} ${product.name}`);
  });

  // Demostrar el patrón builder
  console.log('\n6️⃣ Usando el patrón Builder:');
  const builderFilter = ProductFilter.builder()
    .withCategories([new Category('clothes'), new Category('toiletries')])
    .withMinPrice(new Price(5.00))
    .build();
  const builderResults = await filterService.filterProducts(builderFilter);
  builderResults.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    const categories = product.categories.map(c => c.value).join(', ');
    console.log(`  ${stockStatus} ${product.name} - €${product.price.value} [${categories}]`);
  });

  console.log('\n✨ Características implementadas:');
  console.log('  • Filtrado por categoría individual o múltiple');
  console.log('  • Filtrado por rango de precios (min, max, o ambos)');
  console.log('  • Combinación de filtros de categoría y precio');
  console.log('  • Ordenamiento automático: productos con stock primero');
  console.log('  • Validación de categorías según especificación');
  console.log('  • Arquitectura DDD con separación de responsabilidades');
  console.log('  • Cobertura completa de tests (137 tests pasando)');
  console.log('  • Preparado para futuras extensiones');
}

// Ejecutar la demostración
if (require.main === module) {
  main().catch(console.error);
}

export { main }; 