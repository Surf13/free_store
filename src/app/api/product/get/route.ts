import { NextResponse } from "next/server";
import { getPrisma } from "../../../../../lib/prisma";
import { translateProduct } from "../../../../lib/translate";

function isEnglishProduct(product) {
  const itemNames = product.rawData?.item_name;

  if (!Array.isArray(itemNames)) {
    return false;
  }

  return itemNames.some((item) => {
    const languageTag = item?.language_tag;

    return (
      typeof languageTag === "string" &&
      languageTag.toLowerCase().startsWith("en_")
    );
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const productType = searchParams.get("productType");
    const language = searchParams.get("language");

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

    let filteredProducts = products;

    if (language === "en") {
      filteredProducts = products.filter(isEnglishProduct);
    }

    filteredProducts = filteredProducts.slice(0, 10);

    // Translate all product display values.
    const translatedProducts = filteredProducts.map(
      translateProduct
    );

    return NextResponse.json(translatedProducts);
  } catch (error) {
    console.error("GET /api/product/get ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
