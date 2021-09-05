import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function shouldCreateAbsoluteExpression(prev) {
	if (prev.type !== ParseTreeTokenType.ABSOLUTE_EXPRESSION)
		return true;
	return false;
}

export function processPipe(prev, next) {
	if (shouldCreateAbsoluteExpression(prev)) {
		const absExpression = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.ABSOLUTE_EXPRESSION);
		absExpression.appendChild(next);
		prev.appendChild(absExpression);
		return absExpression;
	}
	else {
		prev.appendChild(next);
		return prev;
	}
};