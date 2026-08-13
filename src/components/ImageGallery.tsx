"use client";

import { useState } from "react";

type ProductImage = {
  id: string;
  type: string;
  displayOrder: number | null;
  image: {
    id: string;
    storageKey: string | null;
    width: number | null;
    height: number | null;
  } | null;
};

type ProductImageGalleryProps = {
  images: ProductImage[];
  itemName: string;
  itemId: string;
};

export default function ProductImageGallery({
  images,
  itemName,
  itemId,
}: ProductImageGalleryProps) {
  const validImages = images.filter(
    (productImage) => productImage.image?.storageKey
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          height: "500px",
          background: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#777",
          borderRadius: "12px",
        }}
      >
        No image available
      </div>
    );
  }

  const selectedImage = validImages[selectedIndex].image!;

  return (
    <section>
      {/* MAIN IMAGE */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "500px",
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: "12px",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={`/api/images/${selectedImage.id}`}
          alt={itemName || itemId}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* THUMBNAILS */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          overflowX: "auto",
          padding: "1rem 0",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {validImages.map((productImage, index) => {
          const image = productImage.image!;

          return (
            <button
              key={`${productImage.image.id}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              style={{
                flex: "0 0 auto",
                width: "90px",
                height: "90px",
                padding: "4px",
                background: "#fff",
                border:
                  index === selectedIndex
                    ? "3px solid #0070f3"
                    : "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <img
                src={`/api/images/${image.id}`}
                alt={`${itemName || itemId} image ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}