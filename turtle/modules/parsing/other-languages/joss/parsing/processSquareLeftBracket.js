import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processSquareLeftBracket(prev, next) {
	const squareBracketExpression = new ParseTreeToken(null, next.lineIndex,
	next.colIndex, ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION);
	squareBracketExpression.appendChild(next);
	prev.appendChild(squareBracketExpression);
	return squareBracketExpression;
};