// src/app/product/page.tsx

export const dynamic = "force-dynamic";

import React from "react";
import { ItemList } from "@/components/ItemList";

export default function ProductPage() {
  return (
    <main>
      <h1>Shoes</h1>
      <ItemList productType="SHOES" />

      <h1>Cell Phone Cases</h1>
      <ItemList productType="CELLULAR_PHONE_CASE" />

      <h1>Furniture</h1>
      <ItemList productType="SOFA" />

      <h1>Furniture Covers</h1>
      <ItemList productType="FURNITURE_COVER" />

      <h1>Drinking Cups</h1>
      <ItemList productType="DRINKING_CUP" />

      <h1>Hardware</h1>
      <ItemList productType="HARDWARE" />

      <h1>Mechanical Components</h1>
      <ItemList productType="MECHANICAL_COMPONENTS" />
    </main>
  );
}