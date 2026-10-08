import { notFound } from "next/navigation";
import { getPrisma, disconnectPrisma } from "@/../lib/prisma";
import { getCartItemQuantity } from "@/../lib/cart";

import ProductImageGallery from "@/components/ImageGallery";
import CartButton from "@/components/cartButton";

import {
  displayValue,
  cleanProductTitle,
} from "@/lib/product-display";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const prisma = await getPrisma();

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        images: {
          include: {
            image: true,
          },

          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });

    if (!product) {
      notFound();
    }

    const initialQuantity = await getCartItemQuantity(product.id);

    /*
     * -----------------------------------------
     * PRODUCT VALUES
     * -----------------------------------------
     */

    const brand = displayValue(product.brand);

    const itemName =
      cleanProductTitle(product.itemName) || "Product";

    const color = displayValue(product.color);

    const description = displayValue(
      product.productDescription
    );

    const bulletPoints = displayValue(
      product.bulletPoints
    );

    /*
     * -----------------------------------------
     * PAGE
     * -----------------------------------------
     */

    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* =====================================
              PRODUCT
          ===================================== */}

          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-2">

              {/* =================================
                  IMAGE GALLERY
              ================================= */}

              <div className="border-b border-gray-200 bg-gray-50 p-6 lg:border-b-0 lg:border-r lg:p-10">
                <ProductImageGallery
                  images={product.images}
                  itemName={itemName}
                  itemId={product.itemId}
                />
              </div>

              {/* =================================
                  PRODUCT INFORMATION
              ================================= */}

              <div className="flex flex-col p-6 sm:p-10">

                {/* Brand */}
                {brand && (
                  <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                    {brand}
                  </p>
                )}

                {/* Product Name */}
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {itemName}
                </h1>

                {/* Price */}
                <div className="mt-6">
                  <span className="text-3xl font-bold text-green-600">
                    Free
                  </span>

                  <span className="ml-2 text-sm text-gray-400">
                    $0.00
                  </span>
                </div>

                {/* Short Details */}
                <div className="mt-8 space-y-3 border-y border-gray-200 py-6">

                  {color && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-medium text-gray-500">
                        Color
                      </span>

                      <span className="text-right text-gray-900">
                        {color}
                      </span>
                    </div>
                  )}

                  {product.productType && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-medium text-gray-500">
                        Product Type
                      </span>

                      <span className="text-right text-gray-900">
                        {product.productType}
                      </span>
                    </div>
                  )}

                  {product.country && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="font-medium text-gray-500">
                        Country
                      </span>

                      <span className="text-right text-gray-900">
                        {product.country}
                      </span>
                    </div>
                  )}

                </div>

                {/* Add To Cart */}
                <div className="mt-8 rounded-2xl bg-gray-50 p-5">
                  <p className="mb-4 text-sm text-gray-500">
                    This item is completely free.
                  </p>

                  <CartButton
                    productId={product.id}
                    initialQuantity={initialQuantity}
                  />
                </div>

                {/* Free Store Message */}
                <div className="mt-6 flex gap-3 rounded-xl bg-green-50 p-4">
                  <div className="text-lg">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Free item
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      There is no charge for this product.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =====================================
              DESCRIPTION
          ===================================== */}

          {description && (
            <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Description
              </h2>

              <p className="mt-4 max-w-4xl whitespace-pre-line leading-7 text-gray-600">
                {description}
              </p>
            </section>
          )}

          {/* =====================================
              FEATURES
          ===================================== */}

          {bulletPoints && (
            <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Features
              </h2>

              <div className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                {bulletPoints}
              </div>
            </section>
          )}

          {/* =====================================
              PRODUCT DETAILS
          ===================================== */}

          <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Product Details
            </h2>

            <div className="mt-6 divide-y divide-gray-100">

              {brand && (
                <div className="flex justify-between gap-6 py-4">
                  <span className="font-medium text-gray-500">
                    Company
                  </span>

                  <span className="text-right text-gray-900">
                    {brand}
                  </span>
                </div>
              )}

              {color && (
                <div className="flex justify-between gap-6 py-4">
                  <span className="font-medium text-gray-500">
                    Color
                  </span>

                  <span className="text-right text-gray-900">
                    {color}
                  </span>
                </div>
              )}

              {product.productType && (
                <div className="flex justify-between gap-6 py-4">
                  <span className="font-medium text-gray-500">
                    Product Type
                  </span>

                  <span className="text-right text-gray-900">
                    {product.productType}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-6 py-4">
                <span className="font-medium text-gray-500">
                  Item ID
                </span>

                <span className="break-all text-right text-gray-900">
                  {product.itemId}
                </span>
              </div>

              {product.marketplace && (
                <div className="flex justify-between gap-6 py-4">
                  <span className="font-medium text-gray-500">
                    Marketplace
                  </span>

                  <span className="text-right text-gray-900">
                    {product.marketplace}
                  </span>
                </div>
              )}

              {product.country && (
                <div className="flex justify-between gap-6 py-4">
                  <span className="font-medium text-gray-500">
                    Country
                  </span>

                  <span className="text-right text-gray-900">
                    {product.country}
                  </span>
                </div>
              )}

            </div>
          </section>

        </div>
      </main>
    );
  } finally {
    await disconnectPrisma();
  }
}