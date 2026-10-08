// src/lib/product-display.js

import { translateValue } from "./translate";

export function displayValue(value) {
  return translateValue(value);
}

export function cleanProductTitle(value) {
  let title = translateValue(value);

  if (!title) {
    return null;
  }

  title = title.trim();

  title = title.replace(
    /^Amazon[-\s]?(?:merk|brand)\s*-\s*/i,
    ""
  );

  title = title.replace(
    /^Amazon['’]s Choice\s*[-:]\s*/i,
    ""
  );

  title = title.replace(
    /^Amazon Brand\s*[-:]\s*/i,
    ""
  );

  title = title.replace(
    /^Amazon-merk\s*[-:]\s*/i,
    ""
  );

  title = title.replace(
    /^find\.\s+/i,
    ""
  );

  title = title.replace(/\s+/g, " ").trim();

  return title;
}
