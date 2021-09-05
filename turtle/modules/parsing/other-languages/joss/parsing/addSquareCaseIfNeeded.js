import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function addSquareCaseIfNeeded(prev, next) {
	if (prev.type !== ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION)
		return prev;

	if (next.type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET ||
	next.type === ParseTreeTokenType.SEMICOLON)
		return prev;
	
	const squareCase = new ParseTreeToken(null, next.lineIndex, next.colIndex,
	ParseTreeTokenType.SQUARE_CASE);
	prev.appendChild(squareCase);
	return squareCase;
};