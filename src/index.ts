import { TextileJs } from "@lwe8/textile-js";
import type {
  Root,
  TextileVisitor,
  TextileExtension,
  TextileExtensionFn,
} from "@lwe8/text-types";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";

//
const textile = new TextileJs();
export interface Options {
  breaks?: boolean;
}
//
function treeWalk(tree: Root, callback: TextileVisitor) {
  visit(tree, callback);
  return tree;
}
export default class Textile {
  private _extensions: TextileExtension[];
  private _tree: Root | {};
  private _html: string;
  private _text: string;
  private _visitors: TextileVisitor[];
  private _breaks: boolean;

  constructor(options?: Options) {
    this._extensions = [];
    this._tree = {};
    this._html = "";
    this._text = "";
    this._visitors = [];
    this._breaks = options?.breaks ?? false;
  }
  private _int() {
    if (this._text === "") {
      throw new Error("You must input text to convert");
    }
    const _html = textile.parse(this._text, { breaks: this._breaks });
    this._tree = fromHtml(_html, { fragment: true });
    if (this._extensions.length > 0) {
      for (const ext of this._extensions) {
        this._tree = treeWalk(this._tree as Root, ext.walk);
      }
    }
    if (this._visitors.length > 0) {
      for (const visitor of this._visitors) {
        this._tree = treeWalk(this._tree as Root, visitor);
      }
    }
    this._html = toHtml(this._tree as Root);
  }

  use(ext: TextileExtensionFn | TextileExtension) {
    const _ext = typeof ext === "function" ? ext() : ext;
    this._extensions.push(_ext);
    return this;
  }
  visit(visitor: TextileVisitor) {
    this._visitors.push(visitor);
    return this;
  }
  parse(text: string) {
    this._text = text;
    this._int();
    return {
      html: this._html,
      hast: this._tree,
    };
  }
}
