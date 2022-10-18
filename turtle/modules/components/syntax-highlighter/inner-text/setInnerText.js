export function setInnerText(node, s) {
	if (node instanceof Element)
		node.innerText = s;
	else
		node.nodeValue = s;
};