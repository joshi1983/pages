export function insertTextAtEnd(node, s) {
	if (s === '')
		return; // nothing to do.
	if (node instanceof Element)
		node.innerText += s;
	else if (node instanceof Node)
		node.nodeValue += s;
	else
		throw new Error('node must be a Node or Element.  Not: ' + node);
};