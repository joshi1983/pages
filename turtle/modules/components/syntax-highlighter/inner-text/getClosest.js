import { isSyntaxHighlighterContainer } from './isSyntaxHighlighterContainer.js';

export function getClosest(node, selector) {
	if (node === null)
		return null;
	else if (isSyntaxHighlighterContainer(node))
		return null;
	else if (node instanceof Element)
		return node.closest(selector);
	else
		return getClosest(node.parentNode, selector);
};