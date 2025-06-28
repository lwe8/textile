const isAttr = (node) =>
  !Array.isArray(node) && typeof node === "object" && node !== null;
const isCode = (node) =>
  Array.isArray(node) && node[0] === "code" && isAttr(node[1]);
const isPre = (node) => Array.isArray(node) && node[0] === "pre";
const hasChild = (node) => Array.isArray(node) && node.some(isCode);
const lancode = (node) => {
  let lang;
  let code;
  if (Array.isArray(node)) {
    if (isAttr(node[1])) {
      const className = node[1].class;
      const lanClass = className
        .split(" ")
        .find((i) => i.startsWith("language-"));
      if (lanClass) {
        lang = lanClass.split("-")[1];
      }
    }
    if (node[2] && typeof node[2] === "string") {
      code = node[2];
    }
  }
  return { lang, code };
};
/**
 *
 * @param {import("./src/types.js").JsonMLElement} node
 */
const getLangCode = (node) => {
  return node
    .map((n) => {
      let aa;
      if (isCode(n)) {
        aa = lancode(n);
      } else {
        aa = null;
      }
      return aa;
    })
    .filter((i) => i !== null)
    .pop();
};
