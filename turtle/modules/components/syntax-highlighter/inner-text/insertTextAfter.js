export function insertTextAfter(node, s) {
	if (!(node instanceof Node))
		throw new Error('node must be a Node. not: ' + node);
	if (typeof s !== 'string')
		throw new Error('s must be a string.  Not: ' + s);
	if (s === '')
		return; // nothing to do.
	let textNode = node.nextSibling;
	while (textNode !== null && textNode instanceof Element) {
		if (textNode.firstChild === null)
			break;
		textNode = textNode.firstChild;
	}
	if (textNode === null)
		node.parentNode.appendChild(document.createTextNode(s));
	else if (textNode.nodeType !== textNode.TEXT_NODE)
		textNode.prepend(document.createTextNode(s));
	else
		textNode.nodeValue = s + textNode.nodeValue;
};