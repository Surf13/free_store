import { notFound } from "next/navigation";
import { getPrisma, disconnectPrisma } from "@/../lib/prisma";
import ProductImageGallery from "@/components/ImageGallery";

import {
  displayValue,
  cleanProductTitle,
} from "@/lib/product-display";

/**
 * Translate multiple strings to English using Google Cloud Translation.
 *
 * This runs on the server only.
 *
 * Add this to your .env:
 *
 * GOOGLE_TRANSLATE_API_KEY=your_key_here
 */
async function translateToEnglish(values) {
  const cleanValues = values.map((value) => {
    if (!value) return "";
    return String(value).trim();
  });

  // Nothing to translate.
  if (!cleanValues.some(Boolean)) {
    return cleanValues;
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  // If translation isn't configured, return the original text.
  // This keeps the product page working.
  if (!apiKey) {
    console.warn(
      "GOOGLE_TRANSLATE_API_KEY is not configured. Using original product text."
    );

    return cleanValues;
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: cleanValues,
          target: "en",
          format: "text",
        }),

        // Don't cache translated text forever.
        // We'll improve this later by storing translations in the database.
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Google Translation API error:",
        response.status,
        errorText
      );

      return cleanValues;
    }

    const data = await response.json();

    const translations =
      data?.data?.translations || [];

    return cleanValues.map((original, index) => {
      return (
        translations[index]?.translatedText ||
        original
      );
    });
  } catch (error) {
    console.error(
      "Translation request failed:",
      error
    );

    // Never let translation failure break the product page.
    return cleanValues;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const prisma = await getPrisma();

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
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

    if (!product) {
      notFound();
    }

    /*
     * -----------------------------------------
     * RAW PRODUCT VALUES
     * -----------------------------------------
     */

    const rawBrand = displayValue(product.brand);

    const rawItemName = cleanProductTitle(
      product.itemName
    );

    const rawColor = displayValue(product.color);

    const rawDescription = displayValue(
      product.productDescription
    );

    const rawBulletPoints = displayValue(
      product.bulletPoints
    );

    /*
     * -----------------------------------------
     * TRANSLATE PRODUCT CONTENT
     * -----------------------------------------
     *
     * We send all text together so we're not
     * making a separate request for every field.
     */

    const [
      brand,
      itemName,
      color,
      description,
      bulletPoints,
    ] = await translateToEnglish([
      rawBrand,
      rawItemName,
      rawColor,
      rawDescription,
      rawBulletPoints,
    ]);

    /*
     * -----------------------------------------
     * PAGE
     * -----------------------------------------
     */

    return (
      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* =====================================
            PRODUCT TITLE
        ===================================== */}

        <h1
          style={{
            fontSize: "2rem",
            lineHeight: "1.3",
            marginBottom: "2rem",
          }}
        >
          {itemName || "Product"}
        </h1>

        {/* =====================================
            IMAGE GALLERY
        ===================================== */}

        <ProductImageGallery
          images={product.images}
          itemName={itemName || "Product"}
          itemId={product.itemId}
        />

        {/* =====================================
            DESCRIPTION
        ===================================== */}

        {description && (
          <section
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #ddd",
            }}
          >
            <h2>Description</h2>

            <p
              style={{
                lineHeight: "1.7",
                color: "#444",
                whiteSpace: "pre-line",
              }}
            >
              {description}
            </p>
          </section>
        )}

        {/* =====================================
            PRICE
        ===================================== */}

        <section
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "#f7f7f7",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#008000",
            }}
          >
            Free
          </div>

          <div
            style={{
              marginTop: "0.25rem",
              color: "#666",
            }}
          >
            $0.00
          </div>
        </section>

        {/* =====================================
            PRODUCT DETAILS
        ===================================== */}

        <section
          style={{
            marginTop: "2rem",
          }}
        >
          <h2>Product Details</h2>

          {brand && (
            <p>
              <strong>Company:</strong>{" "}
              {brand}
            </p>
          )}

          {color && (
            <p>
              <strong>Color:</strong>{" "}
              {color}
            </p>
          )}

          {product.productType && (
            <p>
              <strong>Product Type:</strong>{" "}
              {product.productType}
            </p>
          )}

          <p>
            <strong>Item ID:</strong>{" "}
            {product.itemId}
          </p>

          {product.marketplace && (
            <p>
              <strong>Marketplace:</strong>{" "}
              {product.marketplace}
            </p>
          )}

          {product.country && (
            <p>
              <strong>Country:</strong>{" "}
              {product.country}
            </p>
          )}
        </section>

        {/* =====================================
            FEATURES
        ===================================== */}

        {bulletPoints && (
          <section
            style={{
              marginTop: "2rem",
            }}
          >
            <h2>Features</h2>

            <p
              style={{
                lineHeight: "1.7",
                color: "#444",
                whiteSpace: "pre-line",
              }}
            >
              {bulletPoints}
            </p>
          </section>
        )}
      </main>
    );
  } finally {
    await disconnectPrisma();
  }
}