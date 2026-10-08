import Link from "next/link";
import { storeCategories } from "@/lib/categories";

export const dynamic = "force-dynamic";

/*
This is the Home Page which shows all categories users
can shop in.
*/
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {}

      <section className="bg-black px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Welcome to FreeStore
          </p>

          <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Everything is Free.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Browse our collection of products and find something
            you like. Every item in our store is completely free.
          </p>

          <div className="mt-10">
            <Link
              href="/product"
              className="inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Browse All Products
              <span className="ml-2">→</span>
            </Link>
          </div>

        </div>
      </section>


      {/* =====================================
          CATEGORIES
      ===================================== */}

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Browse by Category
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              Find exactly what you're looking for or explore
              something completely new.
            </p>
          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {storeCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/product?category=${category.slug}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {category.description}
                    </p>
                  </div>

                  <span className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-600 transition group-hover:bg-black group-hover:text-white">
                    →
                  </span>

                </div>

              </Link>
            ))}

          </div>

        </div>
      </section>


      {/* =====================================
          FREE STORE MESSAGE
      ===================================== */}

      <section className="border-t border-gray-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
            ✓
          </div>

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            No price tags. No catch.
          </h2>

         

          <div className="mt-7">
            <Link
              href="/product"
              className="font-semibold text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              View all products →
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}