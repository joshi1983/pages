import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export const typesMap = new Map([
	[ParseTreeTokenType.CASE, ParseTreeTokenType.END_CASE],
	[ParseTreeTokenType.CLASS, ParseTreeTokenType.END_CLASS],
	[ParseTreeTokenType.FOR, ParseTreeTokenType.END_FOR],
	[ParseTreeTokenType.FUNCTION, ParseTreeTokenType.END_FUNCTION],
	[ParseTreeTokenType.IF, ParseTreeTokenType.END_IF],
	[ParseTreeTokenType.LOOP, ParseTreeTokenType.END_LOOP],
	[ParseTreeTokenType.MODULE, ParseTreeTokenType.END_MODULE],
	[ParseTreeTokenType.PROCEDURE, ParseTreeTokenType.END_PROCEDURE],
	[ParseTreeTokenType.PROCESS, ParseTreeTokenType.END_PROCESS],
	[ParseTreeTokenType.RECORD, ParseTreeTokenType.END_RECORD],
	[ParseTreeTokenType.UNION, ParseTreeTokenType.END_UNION]
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