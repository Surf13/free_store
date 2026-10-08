import { getPrisma, disconnectPrisma } from "@/../lib/prisma";

export const dynamic = "force-dynamic";

/*
Shows all products of the specific Category selcted. For example
Fashion will show shoes, necklaces, etc
*/
export default async function CategoriesPage() {
  const prisma = await getPrisma();

  try {
    const categories = await prisma.product.groupBy({
      by: ["productType"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Categories
          </h1>

          <p className="mt-2 text-gray-500">
            Categories currently stored in the database.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {categories.map((category) => (
              <div
                key={category.productType}
                className="flex items-center justify-between border-b border-gray-100 px-6 py-4 last:border-b-0"
              >
                <span className="font-medium text-gray-900">
                  {category.productType || "No category"}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                  {category._count.id} products
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  } finally {
    await disconnectPrisma();
  }
}