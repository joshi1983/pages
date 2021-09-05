import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function shouldCreateDataTypeExpression(token) {
	const dte = getClosestOfType(token, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
	return dte === null;
}

export function processUnderlyingType(prev, next) {
	if (shouldCreateDataTypeExpression(prev)) {
		const dte = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		prev.appendChild(dte);
		prev = dte;
	}
	prev.appendChild(next);
	return next;
};