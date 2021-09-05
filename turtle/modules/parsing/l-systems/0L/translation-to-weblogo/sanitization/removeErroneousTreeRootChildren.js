import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const validTypes = new Set([
	ParseTreeTokenType.ARROW,
	ParseTreeTokenType.ASSIGNMENT
]);

function shouldBeRemoved(token) {
	if (!validTypes.has(token.type))
		return true;

	if ((token.type === ParseTreeTokenType.ARROW ||
	token.type === ParseTreeTokenType.ASSIGNMENT) &&
	token.children.length !== 2)
		return true;

	return false;
}

export function removeErroneousTreeRootChildren(root) {
	for (let i = 0; i < root.children.length; i++) {
		const token = root.children[i];
		if (shouldBeRemoved(token)) {
			token.remove();
			i--; // process the same index with the next iteration.
		}
	}
};