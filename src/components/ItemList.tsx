// src/components/ItemList.tsx

import Link from "next/link";
import { ProductList } from "@/components/ProductList";

export async function ItemList({
  productType,
}: {
  productType: string;
}) {
  const products = await ProductList({ productType });

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "1rem",
        padding: "1rem",
        margin: "0 1rem",
      }}
    >
      {products.map((item) => {
        let itemName = item.itemId;

        if (Array.isArray(item.itemName)) {
          const firstItem = item.itemName[0];

          if (
            typeof firstItem === "object" &&
            firstItem !== null &&
            !Array.isArray(firstItem)
          ) {
            const value = (firstItem as Record<string, unknown>).value;

            if (typeof value === "string" && value.length > 0) {
              itemName = value;
            }
          }
        }

        // Images are ordered by displayOrder in ProductList.
        // The first image is therefore the main image.
        const mainImage = item.images?.[0]?.image;

        return (
          <div
            key={item.id}
            style={{
              flex: "0 0 auto",
              border: "1px solid #ccc",
              padding: "1rem",
              width: "200px",
              textAlign: "center",
              borderRadius: "8px",
            }}
          >
            <Link
              href={`/product/${item.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {mainImage?.storageKey ? (
                <img
                  src={`/api/images/${mainImage.id}`}
                  alt={itemName}
                  style={{
                    width: "85%",
                    height: "150px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "85%",
                    height: "150px",
                    margin: "0 auto",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    borderRadius: "4px",
                  }}
                >
                  No image
                </div>
              )}

              <h3
                style={{
                  margin: "0.5rem 0 0.25rem",
                }}
              >
                {itemName}
              </h3>

              <p
                style={{
                  color: "gray",
                  margin: 0,
                }}
              >
                {item.productType}
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}