import { toHTML } from "./textile/jsonml.mjs";
import parseFlow from "./textile/flow.mjs";

const parsers = {
  /**
   * Textile to JsonML
   * @param {string} text
   * @param {import("./types.mjs").Options} [options]
   * @return {import("./types.mjs").JsonMLNodes}
   */
  toJsonml(text, options) {
    const opts = options ? options : { breaks: true };
    /** @type {import("./types.mjs").JsonMLNodes} */
    const jsonml = parseFlow(text, opts);
    return jsonml;
  },
  /**
   *
   * @param {import("./types.mjs").JsonMLNodes} ml
   */
  ml2Html(ml) {
    return ml.map(toHTML).join("");
  },
};

export default parsers;
