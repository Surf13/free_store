import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getPrisma } from "../../../../../lib/prisma";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET =
  process.env.AWS_S3_BUCKET || "product-images-freestore";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("🖼️ Image request:", id);

  if (!id) {
    return new NextResponse("Missing image ID", {
      status: 400,
    });
  }

  try {
    const prisma = await getPrisma();

    const image = await prisma.image.findUnique({
      where: {
        id: id,
      },
    });

    console.log("🗄️ Database image:", image);

    if (!image) {
      return new NextResponse("Image not found in database", {
        status: 404,
      });
    }

    if (!image.storageKey) {
      return new NextResponse("Image has no storage key", {
        status: 404,
      });
    }

    console.log("☁️ S3 key:", image.storageKey);

    const result = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: image.storageKey,
      })
    );

    if (!result.Body) {
      return new NextResponse("S3 image body is empty", {
        status: 404,
      });
    }

    const bytes = await result.Body.transformToByteArray();

    console.log("✅ Image loaded from S3:", image.storageKey);

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": result.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("❌ Image API error:", error);

    return new NextResponse("Failed to load image", {
      status: 500,
    });
  }
}