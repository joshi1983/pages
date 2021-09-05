import { isPropertyReadToken, processPropertyRead } from '../processPropertyRead.js';
import { processExpressionIndexExpressionReadExpression } from
'../processExpressionIndexExpressionReadExpression.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function processReadExpression(token, result, settings) {
	const parent = token.parentNode;
	if (parent !== null) {
		if (parent.type === ParseTreeTokenType.DOT) {
			const grandParent = parent.parentNode;
			if (isPropertyReadToken(grandParent)) {
				processPropertyRead(grandParent, result, settings);
				return;
			}
		}
	}
	if (token.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION)
		processExpressionIndexExpressionReadExpression(token, result, settings);
	else
		result.append(' :' + token.val + ' ');
};