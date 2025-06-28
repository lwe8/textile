export interface Options {
  breaks?: boolean;
}
export type JsonMLNodes = JsonMLNode[];
export type JsonMLNode = string | JsonMLElement;
export interface JsonMLAttributes {
  [key: string]: string | undefined | Record<string, string | undefined>;
  style?: string;
  lang?: string;
  href?: string;
  title?: string;
  alt?: string;
  src?: string;
  colspan?: string;
  rowspan?: string;
  class?: string;
  id?: string;
}
export interface JsonMLElement {
  0: TagName; // Tag name
  1?: JsonMLAttributes | JsonMLNode | string; // Optional attributes or first child
  [index: number]: JsonMLAttributes | JsonMLNode | undefined; // Remaining items are children or undefined
}
export interface JsonMLVisitor {
  visitElement?(
    node: JsonMLElement,
    index?: number,
    parent?: JsonMLNodes
  ): void;
  visitText?(node: string, index?: number, parent?: JsonMLNodes): void;
}

declare class Textile {
  private _opts;
  private _mltree;
  private _text;
  private _html;
  private _visitors;
  constructor(options?: Options);
  use(visitor: JsonMLVisitor): this;
  private init;
  parse(text: string): {
    html: string;
    jsonml: JsonMLNodes;
  };
  toJsonML(html: string): JsonMLNodes;
}

export type TagName =
  | "a"
  | "abbr"
  | "address"
  | "area"
  | "article"
  | "aside"
  | "audio"
  | "b"
  | "bdi"
  | "bdo"
  | "blockquote"
  | "body"
  | "br"
  | "button"
  | "canvas"
  | "caption"
  | "cite"
  | "code"
  | "col"
  | "colgroup"
  | "data"
  | "datalist"
  | "dd"
  | "del"
  | "details"
  | "dfn"
  | "dialog"
  | "div"
  | "dl"
  | "dt"
  | "em"
  | "embed"
  | "fieldset"
  | "figcaption"
  | "figure"
  | "footer"
  | "form"
  | "h1"
  | "header"
  | "hgroup"
  | "hr"
  | "i"
  | "iframe"
  | "img"
  | "input"
  | "ins"
  | "kbd"
  | "label"
  | "legend"
  | "li"
  | "main"
  | "map"
  | "mark"
  | "menu"
  | "meter"
  | "nav"
  | "noscript"
  | "object"
  | "ol"
  | "optgroup"
  | "option"
  | "output"
  | "p"
  | "picture"
  | "pre"
  | "progress"
  | "q"
  | "rp"
  | "rt"
  | "ruby"
  | "s"
  | "samp"
  | "search"
  | "section"
  | "select"
  | "slot"
  | "small"
  | "source"
  | "span"
  | "strong"
  | "sub"
  | "summary"
  | "sup"
  | "table"
  | "tbody"
  | "td"
  | "template"
  | "textarea"
  | "tfoot"
  | "th"
  | "thead"
  | "time"
  | "tr"
  | "track"
  | "u"
  | "ul"
  | "var"
  | "video"
  | "wbr";

export default Textile;
