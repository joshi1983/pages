import { addCodeBlock } from
'./addCodeBlock.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COMMON,
	ParseTreeTokenType.DIM,
]);
const functionDefinitionTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.END_DEF) {
		const children = token.children;
		return children.length < 2;
	}
	if (functionDefinitionTypes.has(token.type)) {
		return token.children.length >= 2;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processShared(prev, next, functionsMap) {
	prev = getGoodPrevious(prev);
	if (functionDefinitionTypes.has(prev.type)) {
		prev = addCodeBlock(prev, next);
	}
	prev.appendChild(next);
	return next;
};