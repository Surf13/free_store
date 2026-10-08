"use client";

/*
Error Page incase of Issues with Loading.
*/
export default function ProductError({ error, reset }) {
  console.error("Product page error:", error);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl">
          ⚠️
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Unable to Load Products
        </h1>

        <p className="mt-3 text-gray-500">
          We couldn't connect to the product database right now.
          Please refresh the page and try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Refresh Page
        </button>
      </div>
    </main>
  );
}