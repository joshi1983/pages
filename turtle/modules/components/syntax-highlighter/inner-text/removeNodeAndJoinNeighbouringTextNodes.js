export function removeNodeAndJoinNeighbouringTextNodes(node) {
	const next = node.nextSibling;
	const previous = node.previousSibling;
	node.parentNode.removeChild(node);
	if (next !== null && previous !== null && next.nodeType === next.TEXT_NODE && previous.nodeType === previous.TEXT_NODE) {
		previous.nodeValue += next.nodeValue;
		next.parentNode.removeChild(next);
	}
};