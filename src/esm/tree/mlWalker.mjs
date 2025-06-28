import elements from "./elements.mjs";

/** @import { JsonMLNode, JsonMLNodes, JsonMLVisitor } from "../types.mjs" */

/**
 * @param {JsonMLNode} node
 */
const is_element = (node) => Array.isArray(node) && elements.includes(node[0]);
/**
 * @param {JsonMLNode} node
 */
const has_child = (node) => Array.isArray(node) && node.some(is_element);

/**
 * @param {JsonMLNodes} tree
 * @param {JsonMLVisitor} visitor
 */
export default function mlWalk(tree, visitor) {
  /**
   * @param {JsonMLNode} node
   */
  const travis = (node) => {
    const idx = tree.indexOf(node);
    if (typeof node === "string" && visitor.visitText) {
      visitor.visitText(node, idx, tree);
    }
    if (
      typeof node !== "string" &&
      Array.isArray(node) &&
      is_element(node) &&
      visitor.visitElement
    ) {
      visitor.visitElement(node, idx, tree);
      if (has_child(node)) {
        const childs = node.filter((n) => is_element(n));
        childs.forEach((child) => {
          const _idx = childs.indexOf(child);
          if (visitor.visitElement) {
            visitor.visitElement(child, _idx, childs);
          }
        });
      }
    }
  };
  tree.forEach(travis);
}
