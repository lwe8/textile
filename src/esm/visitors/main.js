import parsers from "../core.mjs";
import mlWalk from "../tree/mlWalker.mjs";

/**
 *
 * @param {import("../types.mjs").Options} [options]
 */
function textile(options) {
  const opts = options ?? { breaks: true };
  /** @type {import("../types.mjs").JsonMLNodes} */
  let mltree = [];
  /** @type {string} */
  let text = "";
  /** @type {string} */
  let html = "";
  /** @type {import("../types.mjs").JsonMLVisitor} */
  let visitors = "";

  const init = () => {};
}
