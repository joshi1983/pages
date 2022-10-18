import { insertBefore } from './insertBefore.js';
import { insertTextBefore } from './insertTextBefore.js';

export function insertPlainTextBefore(node, s) {
	if (node.previousSibling !== null && !(node.previousSibling instanceof Element))
		insertTextBefore(node, s);
	else {
		insertBefore(node, document.createTextNode(s));
	}
};