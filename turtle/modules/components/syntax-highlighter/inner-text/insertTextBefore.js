export function insertTextBefore(node, s) {
	if (typeof s !== 'string')
		throw new Error('s must be a string.  Not: ' + s);
	if (s === '')
		return; // nothing to do.
	let textNode = node.previousSibling;
	while (textNode !== null && textNode instanceof Element) {
		if (textNode.lastChild === null)
			break;
		textNode = textNode.lastChild;
	}
	if (textNode === null)
		node.parentNode.prepend(document.createTextNode(s));
	else if (textNode.nodeType !== textNode.TEXT_NODE)
		textNode.appendChild(document.createTextNode(s));
	else
		textNode.nodeValue += s;
};