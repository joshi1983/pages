import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processSquareLeftBracket(prev, next) {
	const subscript = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.ARRAY_SUBSCRIPT);
	subscript.appendChild(next);
	prev.appendChild(subscript);
	return subscript;
};