export function insertAfter(currentNode, newNode) {
	if (currentNode.parentNode === null)
		throw new Error('Unable to add node after because parentNode is null');
	if (currentNode.nextSibling === null)
		currentNode.parentNode.appendChild(newNode);
	else
		currentNode.parentNode.insertBefore(newNode, currentNode.nextSibling);
}