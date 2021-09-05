import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPrevTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	return goodPrevTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processType(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);

	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.END_TYPE) {
		const parent = prev.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.TYPE) {
			const gParent = parent.parentNode;
			if (gParent !== null)
				return gParent;
			return parent;
		}
		return prev;
	}
	else
		return next;
};