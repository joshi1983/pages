/*
isSyntaxHighlighterContainer checks if the specified node is a container.

This is checked to help DOM manipulation from the syntax highlighter from 
searching elements that are unrelated to syntax highlighting.

We don't want logic intended for finding elements in the syntax highlighter to 
apply to elements higher in the document tree than the syntax highlighter container element.
*/
export function isSyntaxHighlighterContainer(node) {
	return node !== null && node instanceof Element &&
		(node.tagName === 'PRE' ||
		node.classList.contains('syntax-highlighter'));
};