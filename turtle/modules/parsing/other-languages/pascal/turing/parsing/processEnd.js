import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesMap = new Map([
	[ParseTreeTokenType.CLASS, ParseTreeTokenType.END_CLASS],
	[ParseTreeTokenType.FOR, ParseTreeTokenType.END_FOR],
	[ParseTreeTokenType.FUNCTION, ParseTreeTokenType.END_FUNCTION],
	[ParseTreeTokenType.IF, ParseTreeTokenType.END_IF],
	[ParseTreeTokenType.LOOP, ParseTreeTokenType.END_LOOP],
	[ParseTreeTokenType.PROCEDURE, ParseTreeTokenType.END_PROCEDURE]
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	return typesMap.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;

	return token;
}

export function processEnd(prev, next) {
	prev = getGoodPrevious(prev);
	const newTokenType = typesMap.get(prev.type);
	if (newTokenType !== undefined) {
		const token = new ParseTreeToken(null, next.lineIndex, next.colIndex, newTokenType);
		token.appendChild(next);
		prev.appendChild(token);
		return token;
	}
	prev.appendChild(next);
	return prev;
};