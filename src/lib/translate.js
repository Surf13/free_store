// src/lib/translate.js

/**
 * Get the preferred display value from an Amazon JSON field.
 *
 * Prefers English values when multiple language versions exist.
 */
export function translateValue(value) {
  if (value == null) {
    return null;
  }

  // Amazon language-value array:
  //
  // [
  //   {
  //     value: "Nike",
  //     language_tag: "en_US"
  //   },
  //   {
  //     value: "Nike",
  //     language_tag: "de_DE"
  //   }
  // ]
  if (Array.isArray(value)) {
    const englishValue = value.find((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        item.value == null
      ) {
        return false;
      }

      const languageTag = item.language_tag;

      return (
        typeof languageTag === "string" &&
        languageTag.toLowerCase().startsWith("en_")
      );
    });

    if (englishValue) {
      return String(englishValue.value);
    }

    // Fall back to the first usable value.
    return value
      .map((item) => {
        if (
          item &&
          typeof item === "object" &&
          item.value != null
        ) {
          return String(item.value);
        }

        return String(item);
      })
      .filter(Boolean)
      .join(", ");
  }

  // Individual Amazon language-value object.
  //
  // {
  //   value: "Nike",
  //   language_tag: "en_US"
  // }
  if (
    typeof value === "object" &&
    value !== null &&
    "value" in value
  ) {
    return String(value.value);
  }

  return String(value);
}


/**
 * Translate/normalize an Amazon product.
 *
 * This is the single place where raw Amazon product fields
 * are converted into values suitable for the UI.
 */
export function translateProduct(product) {
  if (!product) {
    return product;
  }

  return {
    ...product,

    itemName: translateValue(product.itemName),
    brand: translateValue(product.brand),
    color: translateValue(product.color),
  };
}


/**
 * Translate a cart.
 *
 * Only product display fields are changed.
 * Cart quantities, IDs, images, etc. remain untouched.
 */
export function translateCart(cart) {
  if (!cart) {
    return cart;
  }

  return {
    ...cart,

    items: Array.isArray(cart.items)
      ? cart.items.map((item) => ({
          ...item,
          product: translateProduct(item.product),
        }))
      : cart.items,
  };
}
