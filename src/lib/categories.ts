// src/lib/categories.ts

export const storeCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Phones, accessories, chargers, and electronic items.",
    types: [
      "CELLULAR_PHONE_CASE",
      "PORTABLE_ELECTRONIC_DEVICE_COVER",
      "CHARGING_ADAPTER",
    ],
  },

  {
    name: "Fashion",
    slug: "fashion",
    description: "Shoes, jewelry, accessories, and more.",
    types: [
      "SHOES",
      "SANDAL",
      "BOOT",
      "HAT",
      "ACCESSORY",
      "EARRING",
      "FINEEARRING",
      "NECKLACE",
      "FINERING",
      "FINENECKLACEBRACELETANKLET",
    ],
  },

  {
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor, bedding, and household items.",
    types: [
      "HOME",
      "HOME_BED_AND_BATH",
      "HOME_FURNITURE_AND_DECOR",
      "CHAIR",
      "SOFA",
      "RUG",
      "WALL_ART",
      "OTTOMAN",
      "BED",
      "TABLE",
      "FURNITURE_COVER",
      "FLAT_SHEET",
    ],
  },

  {
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    description: "Kitchen and dining products.",
    types: [
      "KITCHEN",
      "DRINKING_CUP",
    ],
  },

  {
    name: "Office",
    slug: "office",
    description: "Products for your office and workspace.",
    types: [
      "OFFICE_PRODUCTS",
    ],
  },

  {
    name: "Tools & Hardware",
    slug: "tools-hardware",
    description: "Tools, hardware, lighting, and plumbing supplies.",
    types: [
      "HARDWARE",
      "HARDWARE_HANDLE",
      "WRENCH",
      "PLUMBING_FIXTURE",
      "LIGHT_FIXTURE",
      "LIGHT_BULB",
      "SAFETY_SUPPLY",
    ],
  },

  {
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
    description: "Beauty, health, and personal care products.",
    types: [
      "BEAUTY",
      "HEALTH_PERSONAL_CARE",
    ],
  },

  {
    name: "Pets",
    slug: "pets",
    description: "Products and supplies for pets.",
    types: [
      "PET_SUPPLIES",
    ],
  },

  {
    name: "Travel",
    slug: "travel",
    description: "Luggage and travel accessories.",
    types: [
      "SUITCASE",
      "LUGGAGE",
    ],
  },

  

  {
    name: "Grocery",
    slug: "grocery",
    description: "Food and grocery products.",
    types: [
      "GROCERY",
    ],
  },

  {
    name: "Cleaning",
    slug: "cleaning",
    description: "Cleaning and janitorial supplies.",
    types: [
      "JANITORIAL_SUPPLY",
    ],
  },
] as const;


/**
 * Find the storefront category for a database product type.
 */
export function getStoreCategory(productType: string) {
  return storeCategories.find((category) =>
    category.types.includes(productType as never)
  );
}