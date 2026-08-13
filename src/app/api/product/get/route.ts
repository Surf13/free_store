import { NextResponse } from "next/server";
import { getPrisma } from "../../../../../lib/prisma";

function isEnglishProduct(product: any): boolean {
  const itemNames = product.rawData?.item_name;

  if (!Array.isArray(itemNames)) {
    return false;
  }

  return itemNames.some((item: any) => {
    const languageTag = item?.language_tag;

    return (
      typeof languageTag === "string" &&
      languageTag.toLowerCase().startsWith("en_")
    );
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const productType = searchParams.get("productType");
    const language = searchParams.get("language");

    console.log("GET /api/product/get");
    console.log("productType:", productType);
    console.log("language:", language);

    const prisma = await getPrisma();

    const products = await prisma.product.findMany({
      where: productType
        ? {
            productType,
          }
        : undefined,

      // Get more than 10 because some products will be
      // filtered out for not being English.
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

    // Only filter when ?language=en is requested.
    if (language === "en") {
      filteredProducts = products.filter(isEnglishProduct);
    }

    // Keep the UI at 10 products.
    filteredProducts = filteredProducts.slice(0, 10);

    console.log(
      `Fetched ${products.length} products, returning ${filteredProducts.length} English products`
    );

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("GET /api/product/get ERROR:");
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}