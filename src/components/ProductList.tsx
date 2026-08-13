// src/components/ProductList.tsx

import { getPrisma } from "../../lib/prisma";

export async function ProductList({
  productType,
}: {
  productType?: string;
}) {
  const prisma = await getPrisma();

  const products = await prisma.product.findMany({
    where: productType
      ? {
          productType,
        }
      : undefined,

    take: 100,

    orderBy: {
      id: "asc",
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

  const englishProducts = products.filter((product) => {
    const rawData = product.rawData;

    if (
      typeof rawData !== "object" ||
      rawData === null ||
      Array.isArray(rawData)
    ) {
      return false;
    }

    const itemNames = (rawData as Record<string, unknown>).item_name;

    if (!Array.isArray(itemNames)) {
      return false;
    }

    return itemNames.some((item: unknown) => {
      if (
        typeof item !== "object" ||
        item === null ||
        Array.isArray(item)
      ) {
        return false;
      }

      const languageTag = (item as Record<string, unknown>).language_tag;

      return (
        typeof languageTag === "string" &&
        languageTag.toLowerCase().startsWith("en_")
      );
    });
  });

  const finalProducts = englishProducts.slice(0, 10);

  console.log(
    `Fetched ${products.length} products, returning ${finalProducts.length} English products`
  );

  return finalProducts;
}