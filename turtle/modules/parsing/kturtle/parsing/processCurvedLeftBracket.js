import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processCurvedLeftBracket(previousToken, nextToken) {
	const curvedBracketExpression = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	if (previousToken.type === ParseTreeTokenType.COMMA)
		curvedBracketExpression.appendSibling(nextToken);
	else
		curvedBracketExpression.appendChild(nextToken);
	previousToken.appendChild(curvedBracketExpression);
	return curvedBracketExpression;
};