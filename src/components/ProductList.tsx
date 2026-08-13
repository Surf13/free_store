// src/components/ProductList.tsx

export async function ProductList({
  productType,
}: {
  productType?: string;
}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url = new URL(`${baseUrl}/api/product/get`);

  if (productType) {
    url.searchParams.set("productType", productType);
  }

  // Only request English products
  url.searchParams.set("language", "en");

  const res = await fetch(url.toString());

  if (!res.ok) {
    const body = await res.text();

    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText} - ${body}`
    );
  }

  const products = await res.json();

  console.log("Fetched English products:", products);

  return products;
}