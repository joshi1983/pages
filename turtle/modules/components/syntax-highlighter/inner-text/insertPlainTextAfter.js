import { insertAfter } from './insertAfter.js';
import { insertTextAfter } from './insertTextAfter.js';

export function insertPlainTextAfter(node, s) {
	if (node.nextSibling !== null && !(node.nextSibling instanceof Element))
		insertTextAfter(node, s);
	else {
		insertAfter(node, document.createTextNode(s));
	}
};