"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  itemId?: string;
  itemName?: string | unknown[];
  productType?: string;
  images?: {
    image?: {
      id?: string;
    };
  }[];
};

export function ItemList({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ProductCard({ item }: { item: Product }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const itemName = Array.isArray(item.itemName)
  ? String(
      (item.itemName[0] as { value?: unknown })?.value ??
        item.itemId ??
        "Unnamed Product"
    )
  : String(item.itemName ?? item.itemId ?? "Unnamed Product");
  
  const mainImage = item.images?.[0]?.image;

  const imageUrl = mainImage?.id
    ? `/api/images/${mainImage.id}`
    : null;

  async function handleAddToCart() {
    if (adding) return;

    setAdding(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Link */}
      <Link
        href={`/product/${item.id}`}
        className="block"
      >
        {/* Image */}
        <div className="flex h-64 items-center justify-center overflow-hidden bg-gray-50 p-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={itemName}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="px-5 pt-5">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
            {itemName}
          </h3>

          {item.productType && (
            <p className="mt-1 text-sm text-gray-500">
              {item.productType}
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="p-5 pt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
            added
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-gray-800"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {adding
            ? "Adding..."
            : added
              ? "Added ✓"
              : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}