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
        const itemName = Array.isArray(item.itemName)
          ? item.itemName[0]?.value ?? item.itemId
          : item.itemId;

        // Images are ordered by displayOrder in /api/product/get.
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