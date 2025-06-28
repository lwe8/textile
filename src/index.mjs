import parsers from "./esm/core.mjs";
import mlWalk from "./esm/tree/mlWalker.mjs";
import html2ml from "./esm/tree/html2ml.mjs";

/** @import  {JsonMLNodes,JsonMLVisitor,Options} from "." */

class Textile {
  /**
   *
   * @param {Options} [options]
   */
  constructor(options) {
    /**
     * @private
     * @type {Options}
     */
    this._opts = options ?? { breaks: true };
    /**
     * @private
     * @type {JsonMLTree}
     */
    this._mltree = [];
    /**
     * @private
     * @type {string}
     */
    this._text = "";
    /**
     * @private
     * @type {string}
     */
    this._html = "";
    /**
     * @private
     * @type {JsonMLVisitor[]}
     */
    this._visitors = [];
  }
  /**
   *
   * @param {JsonMLVisitor} visitor
   * @returns {this}
   */
  use(visitor) {
    this._visitors.push(visitor);
    return this;
  }
  /**
   * @private
   */
  init() {
    if (this._text === "") {
      throw new Error("Error");
    }
    this._mltree = parsers.toJsonml(this._text, this._opts);
    if (this._visitors.length > 0) {
      for (const visitor of this._visitors) {
        mlWalk(this._mltree, visitor);
      }
    }
    this._html = parsers.ml2Html(this._mltree);
  }
  /**
   * Textile Parser
   * @param {string} text
   * @returns {{html:string;jsonml:JsonMLNodes}}
   */
  parse(text) {
    this._text = text;
    this.init();
    return {
      html: this._html,
      jsonml: this._mltree,
    };
  }
  /**
   * HTML to Json ML
   * @param {string} html
   * @returns {JsonMLNodes}
   */
  toJsonML(html) {
    return html2ml(html);
  }
}

export default Textile;
