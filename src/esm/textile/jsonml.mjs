import { singletons } from "./html.mjs";

// drop or add tab levels to JsonML tree
function reIndent(ml, shiftBy) {
  // a bit obsessive, but there we are...
  if (!shiftBy) {
    return ml;
  }
  return ml.map(function (s) {
    if (/^\n\t+/.test(s)) {
      if (shiftBy < 0) {
        s = s.slice(0, shiftBy);
      } else {
        for (let i = 0; i < shiftBy; i++) {
          s += "\t";
        }
      }
    } else if (Array.isArray(s)) {
      return reIndent(s, shiftBy);
    }
    return s;
  });
}

function escape(text, escapeQuotes) {
  return text
    .replace(
      /&(?!(#\d{2,}|#x[\da-fA-F]{2,}|[a-zA-Z][a-zA-Z1-4]{1,6});)/g,
      "&amp;"
    )
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, escapeQuotes ? "&quot;" : '"')
    .replace(/'/g, escapeQuotes ? "&#39;" : "'");
}

function toHTML(jsonml) {
  jsonml = jsonml.concat();

  // basic case
  if (typeof jsonml === "string") {
    return escape(jsonml);
  }

  const tag = jsonml.shift();
  let attributes = {};
  let tagAttrs = "";
  const content = [];

  if (
    jsonml.length &&
    typeof jsonml[0] === "object" &&
    !Array.isArray(jsonml[0])
  ) {
    attributes = jsonml.shift();
  }

  while (jsonml.length) {
    content.push(toHTML(jsonml.shift()));
  }

  for (const a in attributes) {
    tagAttrs +=
      attributes[a] == null
        ? ` ${a}`
        : ` ${a}="${escape(String(attributes[a]), true)}"`;
  }

  // be careful about adding whitespace here for inline elements
  if (tag === "!") {
    return `<!--${content.join("")}-->`;
  } else if (tag in singletons || (tag.indexOf(":") > -1 && !content.length)) {
    return `<${tag}${tagAttrs} />`;
  } else {
    return `<${tag}${tagAttrs}>${content.join("")}</${tag}>`;
  }
}

export { reIndent, toHTML, escape };
