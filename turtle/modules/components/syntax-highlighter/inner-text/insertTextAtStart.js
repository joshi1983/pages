export function insertTextAtStart(node, s) {
	if (s === '')
		return; // nothing to do.
	if (node instanceof Element)
		node.innerText = s + node.innerText;
	else
		node.nodeValue = s + node.nodeValue;
};