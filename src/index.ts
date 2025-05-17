import { TextileJs } from "@lwe8/textile-js";
import type {
	Comment as IComment,
	Doctype as IDoctype,
	Element as IElement,
	ElementContent as IElementContent,
	Node as INode,
	Root as IRoot,
	Text as IText,
} from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";

//
export interface Root extends IRoot {}
export interface Doctype extends IDoctype {}
export type ElementContent = IElementContent;
export interface Node extends INode {}
export interface Element extends IElement {}
export interface Text extends IText {}
export interface Comment extends IComment {}

export type TextileVisitor = (
	node: Root | Doctype | ElementContent,
	index?: number,
	parent?: Root | Element,
) => any;
export interface TextileTreeWalker {
	walk: TextileVisitor;
}
export interface TextileExtension extends TextileTreeWalker {}
export type TextileExtensionFn = (...args: any[]) => TextileExtension;

//
const textile = new TextileJs();

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

	constructor() {
		this._extensions = [];
		this._tree = {};
		this._html = "";
		this._text = "";
		this._visitors = [];
	}
	private _int() {
		if (this._text === "") {
			throw new Error("You must input text to convert");
		}
		const _html = textile.parse(this._text);
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
