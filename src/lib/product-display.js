// src/lib/product-display.js

/**
 * Get a human-readable value from Amazon's JSON fields.
 *
 * Prefers English values when multiple language versions exist.
 */
export function displayValue(value) {
  if (value == null) {
    return null;
  }

  // Amazon commonly stores values like:
  //
  // [
  //   {
  //     value: "Some product",
  //     language_tag: "en_US"
  //   }
  // ]
  //
  if (Array.isArray(value)) {
    // First look for an English value.
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

    // Fall back to the first available value.
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

  // Handle an individual Amazon object:
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
 * Clean up Amazon product titles.
 *
 * Example:
 *
 * "Amazon-Brand - find. Women's Leather Shoes, Blue, Size 5"
 *
 * becomes:
 *
 * "Women's Leather Shoes, Blue, Size 5"
 */
export function cleanProductTitle(value) {
  let title = displayValue(value);

  if (!title) {
    return null;
  }

  title = title.trim();

  // Remove common Amazon brand prefixes.
  //
  // Examples:
  // "Amazon-merk - vinden. ..."
  // "Amazon Brand - Amazon Basics ..."
  // "Amazon brand - find. ..."
  //
  title = title.replace(
    /^Amazon[-\s]?(?:merk|brand)\s*-\s*/i,
    ""
  );

  // Remove "Amazon's Choice" if it appears in the title.
  title = title.replace(
    /^Amazon['’]s Choice\s*[-:]\s*/i,
    ""
  );

  // Remove "Amazon Brand" prefixes.
  title = title.replace(
    /^Amazon Brand\s*[-:]\s*/i,
    ""
  );

  // Remove "Amazon-merk" prefixes in different capitalization.
  title = title.replace(
    /^Amazon-merk\s*[-:]\s*/i,
    ""
  );

  // Remove a leading "find." brand if it remains.
  title = title.replace(
    /^find\.\s+/i,
    ""
  );

  // Remove excessive whitespace.
  title = title.replace(/\s+/g, " ").trim();

  return title;
}