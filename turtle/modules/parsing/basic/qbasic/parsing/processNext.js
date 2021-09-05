import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.FOR_EACH) {
		return lastChild !== undefined && lastChild.type === ParseTreeTokenType.CODE_BLOCK;
	}
	if (token.type === ParseTreeTokenType.FOR) {
		const parent = token.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.EXIT)
			return false;
		if (lastChild !== undefined) {
			if (lastChild.type === ParseTreeTokenType.NEXT)
				return false;
		}
		return true;
	}
	return false;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processNext(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};