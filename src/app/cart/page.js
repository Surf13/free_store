"use client";

import { useEffect, useState } from "react";

import {
  displayValue,
  cleanProductTitle,
} from "@/lib/product-display";


//This is the Shopping Cart Page
/*
Displays items current stored in users cart and 
gives an option to checkout user.
*/
export default function Page() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [purchased, setPurchased] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const response = await fetch("/api/cart");

        if (!response.ok) {
          throw new Error("Failed to load cart");
        }

        const data = await response.json();
        setCart(data);
      } catch (err) {
        console.error("Cart load error:", err);
        setError("Unable to load your cart.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      setPurchased(true);
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("Unable to complete your purchase.");
    } finally {
      setCheckoutLoading(false);
    }
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
            <p className="mt-3 text-gray-500">Loading your cart...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
            <p className="mt-3 text-red-500">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (purchased) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Thank You for Your Purchase!
            </h1>

            <p className="mt-3 text-gray-500">
              Your order has been completed successfully.
            </p>

            <p className="mt-2 text-gray-500">
              We hope you enjoy your purchase!
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🛒
            </div>

            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Your Cart is Empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Looks like you haven't added anything to your cart yet.
              Start shopping and your items will appear here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Shopping Cart
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
            Your Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review the items you've selected before checking out.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Cart Items */}
          <section className="space-y-4">
            {cart.items.map((item) => {
              const product = item.product;

              const itemName =
                cleanProductTitle(product.itemName) ||
                "Unnamed product";

              const brand = displayValue(product.brand);
              const color = displayValue(product.color);

              const mainImage =
                product.images?.find(
                  (image) => image.type === "main"
                ) || product.images?.[0];

              const imageId = mainImage?.image?.id;

              return (
                <article
                  key={item.id}
                  className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Product Image */}
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:h-40 sm:w-40">
                    {imageId ? (
                      <img
                        src={`/api/images/${imageId}`}
                        alt={itemName}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        No image
                      </span>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                        {itemName}
                      </h2>

                      {brand && (
                        <p className="mt-2 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            Brand:
                          </span>{" "}
                          {brand}
                        </p>
                      )}

                      {color && (
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">
                            Color:
                          </span>{" "}
                          {color}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Cart Summary */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="my-5 border-t border-gray-200" />

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Items</span>
              <span>{cart.items.length}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>Total quantity</span>
              <span>
                {cart.items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="my-5 border-t border-gray-200" />

           <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              Total
            </span>

            <span className="text-lg font-bold text-green-600">
              Free
            </span>
          </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="mt-6 w-full rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
            </button>

            {checkoutError && (
            <p className="mt-3 text-center text-sm text-red-500">
              {checkoutError}
            </p>
          )}
          </aside>
        </div>
      </div>
    </main>
  );
}
