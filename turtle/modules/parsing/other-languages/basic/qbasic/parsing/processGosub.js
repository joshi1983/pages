import { createEmptyArgList } from './createArgList.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.ON) {
		const children = token.children;
		return children.length < 2;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processGosub(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	const argList = createEmptyArgList({
		'lineIndex': next.lineIndex,
		'colIndex': next.colIndex + 1
	});
	next.appendChild(argList);
	return argList;
};