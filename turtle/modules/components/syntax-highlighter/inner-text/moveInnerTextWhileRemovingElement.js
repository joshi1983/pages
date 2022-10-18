export function moveInnerTextWhileRemovingElement(element) {
	const childNodes = Array.from(element.childNodes);
	const parent = element.parentNode;
	const prev = element.previousSibling;
	element.parentNode.removeChild(element);
	if (prev === null)
		parent.prepend(...childNodes);
	else if (prev.nextSibling === null)
		parent.append(...childNodes);
	else {
		childNodes.forEach(function(node) {
			parent.insertBefore(node, prev.nextSibling);
		});
	}
};