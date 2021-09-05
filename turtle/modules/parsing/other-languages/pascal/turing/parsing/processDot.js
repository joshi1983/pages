import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const previousTypesForExpressionDotProperty = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
	ParseTreeTokenType.IDENTIFIER
]);

function shouldCreateExpressionDotProperty(prev) {
	return previousTypesForExpressionDotProperty.has(prev.type);
}

export function processDot(prev, next) {
	if (shouldCreateExpressionDotProperty(prev)) {
		const edp = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
		ParseTreeTokenType.EXPRESSION_DOT_PROPERTY);
		const prevParent = prev.parentNode;
		prev.remove();
		edp.appendChild(prev);
		edp.appendChild(next);
		prevParent.appendChild(edp);
		return edp;
	}
	prev.appendChild(next);
	return prev;
};