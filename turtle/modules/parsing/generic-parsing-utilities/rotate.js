import { isAfterOrSame } from './isAfterOrSame.js';

/*
parentToken is assumed to have 2 child tokens.
direction should be:
0 for a left rotation
1 for a right rotation
*/
function rotate(parentToken, direction) {
	const grandParent = parentToken.parentNode;
	if (grandParent === null)
		throw new Error(`Can not rotate because parentToken is a root. parentToken.parentNode=${parentToken.parentNode}.`);

	const child = parentToken.children[direction];
	const grandChild = child.children[1 - direction];
	if (grandChild !== undefined) {
		grandChild.remove();
		parentToken.replaceChild(child, grandChild);
	}
	child.remove();
	grandParent.replaceChild(parentToken, child);
	if (isAfterOrSame(parentToken, child))
		child.appendChild(parentToken);
	else
		child.insertAsFirstChild(parentToken);
};

export function leftRotate(parentToken) {
	rotate(parentToken, 0);
};

export function rightRotate(parentToken) {
	rotate(parentToken, 1);
};