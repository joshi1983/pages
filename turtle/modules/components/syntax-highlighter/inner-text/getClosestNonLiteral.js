import { isLiteralElement } from './isLiteralElement.js';
import { isSyntaxHighlighterContainer } from './isSyntaxHighlighterContainer.js';

export function getClosestNonLiteral(node) {
	let prev = node;
	if (!(node instanceof Element))
		node = node.parentNode;
	if (node instanceof Element) {
		while (node !== null) {
			if (isSyntaxHighlighterContainer(node))
				throw new Error('Unable to find non-literal ancestor Element.  Found root of syntax highlighter instead');
			if (!isLiteralElement(node))
				return [node, prev];
			prev = node;
			node = node.parentNode;
		}
	}
	throw new Error('Unable to find non-literal ancestor Element');
};