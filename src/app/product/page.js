// src/app/product/page.js

export const dynamic = "force-dynamic";

import Link from "next/link";
import { ItemList } from "@/components/ItemList";
import { ProductList } from "@/components/ProductList";
import { storeCategories } from "@/lib/categories";

/*
Redesigned Webpage for easier navigation. Currently shows varius Categories
and allows users to navigate to specific Product Pages Easier.
*/
export default async function ProductPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params.category;

  /*
   * Find the category selected from the URL.
   *
   * Example:
   * /product?category=fashion
   */

  const activeCategory = storeCategories.find(
    (category) => category.slug === selectedCategory
  );

  /*
   * -----------------------------------------
   * ALL PRODUCTS
   * -----------------------------------------
   */

  if (!activeCategory) {
    const productsByCategory = await Promise.all(
      storeCategories.map(async (category) => {
        const products = await ProductList({
          productTypes: category.types,
        });

        return {
          ...category,
          products,
        };
      })
    );

    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              FreeStore
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              All Products
            </h1>

            <p className="mt-3 max-w-2xl text-gray-500">
              Browse everything currently available in the store.
            </p>
          </div>

          {/* Category Navigation */}
          <CategoryNavigation />

          {/* Product Categories */}
          <div className="mt-12 space-y-16">
            {productsByCategory.map((category) => {
              if (category.products.length === 0) {
                return null;
              }

              return (
                <section key={category.slug}>
                  <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {category.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {category.description}
                      </p>
                    </div>

                    <Link
                      href={`/product?category=${category.slug}`}
                      className="hidden text-sm font-semibold text-gray-700 hover:text-black sm:block"
                    >
                      View category →
                    </Link>
                  </div>

                  <ItemList products={category.products} />
                </section>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  /*
   * -----------------------------------------
   * FILTERED CATEGORY
   * -----------------------------------------
   */

  const products = await Promise.all(
    activeCategory.types.map((type) =>
      ProductList({
        productType: type,
      })
    )
  );

  const categoryProducts = products.flat();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/product"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← All Products
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
            Category
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {activeCategory.name}
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            {activeCategory.description}
          </p>
        </div>

        {/* Category Navigation */}
        <CategoryNavigation
          activeSlug={activeCategory.slug}
        />

        {/* Products */}
        <section className="mt-12">
          {categoryProducts.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  Showing {categoryProducts.length} products
                </p>
              </div>

              <ItemList products={categoryProducts} />
            </>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-gray-500">
                There aren't any products in this category yet.
              </p>

              <Link
                href="/product"
                className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}


/*
 * -----------------------------------------
 * CATEGORY NAVIGATION
 * -----------------------------------------
 */

function CategoryNavigation({ activeSlug }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href="/product"
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          !activeSlug
            ? "bg-black text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        All
      </Link>

      {storeCategories.map((category) => (
        <Link
          key={category.slug}
          href={`/product?category=${category.slug}`}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            activeSlug === category.slug
              ? "bg-black text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}