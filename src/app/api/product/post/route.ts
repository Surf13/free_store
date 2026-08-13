import { NextResponse } from "next/server";
import { getPrisma } from "../../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      itemId,
      domainName,
      marketplace,
      country,
      productType,

      brand,
      itemName,
      color,
      material,
      style,
      modelName,
      modelNumber,
      modelYear,

      bulletPoints,
      keywords,
      dimensions,
      weight,
      nodes,

      colorCode,
      fabricType,
      finishType,
      itemShape,
      pattern,
      productDescription,

      spinId,
      model3dId,

      rawData,
    } = body;

    // Required fields from the new Product schema
    if (!itemId || !domainName || !rawData) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["itemId", "domainName", "rawData"],
        },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();

    const newProduct = await prisma.product.create({
      data: {
        itemId,
        domainName,
        marketplace,
        country,
        productType,

        brand,
        itemName,
        color,
        material,
        style,
        modelName,
        modelNumber,
        modelYear,

        bulletPoints,
        keywords,
        dimensions,
        weight,
        nodes,

        colorCode,
        fabricType,
        finishType,
        itemShape,
        pattern,
        productDescription,

        spinId,
        model3dId,

        rawData,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create Product:", error);

    return NextResponse.json(
      {
        error: "Failed to create Product",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}