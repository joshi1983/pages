import { isStrictlyAfter } from '../../../generic-parsing-utilities/isStrictlyAfter.js';

export function addChildrenUpTo(newParent, afterToken) {
	let children = newParent.parentNode.children;
	let index = children.indexOf(newParent) + 1;
	while (children.length > index &&
	isStrictlyAfter(afterToken, children[index])) {
		const next = children[index];
		next.remove();
		newParent.appendChild(next);
	}
};