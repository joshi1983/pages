export function getInnerText(node) {
	if (node instanceof Element)
		return node.innerText;
	else if (node.nodeType === node.TEXT_NODE)
		return node.nodeValue;
	else
		return ''; // all other nodes have no inner text.
};