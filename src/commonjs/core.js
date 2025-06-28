const { toHTML } = require("./textile/jsonml.js");
const { parseFlow } = require("./textile/flow.js");

const parsers = {
  /**
   * Textile to JsonML
   * @param {string} text
   * @param {import("./types.js").Options} [options]
   * @return {import("./types.js").JsonMLNodes}
   */
  toJsonml(text, options) {
    const opts = options ? options : { breaks: true };
    /** @type {import("./types.js").JsonMLNodes} */
    const jsonml = parseFlow(text, opts);
    return jsonml;
  },
  /**
   *
   * @param {import("./types.js").JsonMLNodes} ml
   */
  ml2Html(ml) {
    return ml.map(toHTML).join("");
  },
};

module.exports = parsers;
