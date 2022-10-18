export function insertBefore(currentNode, newNode) {
	if (currentNode.previousSibling === null)
		currentNode.parentNode.prepend(newNode);
	else
		currentNode.parentNode.insertBefore(newNode, currentNode);
}