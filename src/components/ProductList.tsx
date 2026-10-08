// src/components/ProductList.tsx

import { getPrisma } from "../../lib/prisma";

type ProductListProps = {
  productType?: string;
  productTypes?: string[];
};

export async function ProductList({
  productType,
  productTypes,
}: ProductListProps) {
  const prisma = await getPrisma();

  /*
   * Allow the component to receive either:
   *
   * productType="SHOES"
   *
   * or:
   *
   * productTypes=["SHOES", "SANDAL", "BOOT"]
   *
   * This lets category pages fetch multiple database
   * product types with one Prisma query.
   */

  const types = productTypes ?? (productType ? [productType] : []);

  const products = await prisma.product.findMany({
    where: types.length
      ? {
          productType: {
            in: types,
          },
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

  /*
   * Only display products that:
   *
   * 1. Have English product information
   * 2. Have at least one usable image
   */

  const englishProducts = products.filter((product) => {
    const hasImage =
      Array.isArray(product.images) &&
      product.images.some((image) => image.image?.id);

    if (!hasImage) {
      return false;
    }

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

      const languageTag = (item as Record<string, unknown>)
        .language_tag;

      return (
        typeof languageTag === "string" &&
        languageTag.toLowerCase().startsWith("en_")
      );
    });
  });

  /*
   Keep the storefront from displaying too many products
   at once.
   */

  const finalProducts = englishProducts.slice(0, 10);

  console.log(
    `Fetched ${products.length} products, returning ${finalProducts.length} English products`
  );

  return finalProducts;
}