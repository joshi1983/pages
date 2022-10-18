import { isLiteralElement } from './isLiteralElement.js';
import { isSyntaxHighlighterContainer } from './isSyntaxHighlighterContainer.js';

export function getClosestLiteral(node) {
	if (node === null || isSyntaxHighlighterContainer(node))
		return;
	else if (isLiteralElement(node))
		return node;
	else
		return getClosestLiteral(node.parentNode);
};