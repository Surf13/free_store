"use client";

import { useState } from "react";

export default function CartButton({
productId,
initialQuantity = 0,
}) {
const [quantity, setQuantity] = useState(initialQuantity);
const [loading, setLoading] = useState(false);

async function addToCart() {
if (loading) return;

setLoading(true);

try {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Failed to add product to cart"
    );
  }

  setQuantity(data.quantity);
} catch (error) {
  console.error("Add to cart error:", error);
  alert(error.message);
} finally {
  setLoading(false);
}


}

async function removeFromCart() {
if (loading || quantity <= 0) return;

setLoading(true);

try {
  const response = await fetch("/api/cart", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Failed to remove product from cart"
    );
  }

  setQuantity(data.quantity);
} catch (error) {
  console.error("Remove from cart error:", error);
  alert(error.message);
} finally {
  setLoading(false);
}


}

return (
<div
style={{
marginTop: "1rem",
display: "flex",
alignItems: "center",
gap: "0.75rem",
}}
>
{quantity === 0 ? (
<button
type="button"
onClick={addToCart}
disabled={loading}
style={{
padding: "0.75rem 1.5rem",
borderRadius: "8px",
border: "none",
background: "#008000",
color: "white",
fontSize: "1rem",
fontWeight: "bold",
cursor: loading ? "wait" : "pointer",
opacity: loading ? 0.6 : 1,
}}
>
{loading ? "Adding..." : "Add to Cart"}
</button>
) : (
<>
<button
type="button"
onClick={removeFromCart}
disabled={loading}
style={{
width: "42px",
height: "42px",
borderRadius: "8px",
border: "1px solid #ccc",
background: "white",
fontSize: "1.4rem",
cursor: loading ? "wait" : "pointer",
}}
>
−
</button>

      <span
        style={{
          minWidth: "40px",
          textAlign: "center",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={addToCart}
        disabled={loading}
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "8px",
          border: "none",
          background: "#008000",
          color: "white",
          fontSize: "1.4rem",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        +
      </button>
    </>
  )}

  {quantity > 0 && (
    <span
      style={{
        color: "#555",
        fontSize: "0.95rem",
      }}
    >
      {quantity} in cart
    </span>
  )}
</div>


);
}