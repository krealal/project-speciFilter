import { ProductService } from './ProductService';
import { Product } from './Product';
import { ProductFilter } from './ProductFilter';

export async function main() {
  console.log('🏪 Sistema de Filtrado de Productos - TheRefactorShop');
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

  // Ejemplo 1: Filtrar por categoría
  console.log('\n1️⃣ Filtrar productos de comida:');
  const foodFilter = new ProductFilter(['food']);
  const foodProducts = productService.filterProducts(foodFilter);
  foodProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price}`);
  });

  // Ejemplo 2: Filtrar por precio
  console.log('\n2️⃣ Filtrar productos entre €1.00 y €10.00:');
  const priceFilter = ProductFilter.builder()
    .withPriceRange(1.00, 10.00)
    .build();
  const priceRangeProducts = productService.filterProducts(priceFilter);
  priceRangeProducts.forEach(product => {
    const stockStatus = product.hasStock ? '✅' : '❌';
    console.log(`  ${stockStatus} ${product.name} - €${product.price}`);
  });

  // Ejemplo 3: Combinar múltiples criterios
  console.log('\n3️⃣ Filtrar comida barata (< €2.00):');
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
}

main();