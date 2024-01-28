/*
parentToken is assumed to have 2 child tokens.
direction should be:
0 for a left rotation
1 for a right rotation
*/
function rotate(parentToken, direction) {
	const grandParent = parentToken.parentNode;
	const child = parentToken.children[direction];
	const grandChild = child.children[1 - direction];
	child.removeChild(grandChild);
	parentToken.replaceChild(child, grandChild);
	if (grandParent !== null)
		grandParent.replaceChild(parentToken, child);
	else
		child.parentNode = null;
	child.appendChild(parentToken);
};

export function leftRotate(parentToken) {
	rotate(parentToken, 0);
};

export function rightRotate(parentToken) {
	rotate(parentToken, 1);
};