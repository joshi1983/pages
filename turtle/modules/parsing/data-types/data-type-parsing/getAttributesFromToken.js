import { DataTypeTokenType } from
'./DataTypeTokenType.js';
import { isNumber } from
'../../../isNumber.js';

export function getAttributesFromToken(token) {
	const result = {};
	const attributesExpressions = token.children.
		filter(t => t.type === DataTypeTokenType.ATTRIBUTES_EXPRESSION);
	if (attributesExpressions.length === 1) {
		const attributesExpression = attributesExpressions[0];
		for (const assignment of attributesExpression.children) {
			if (assignment.type === DataTypeTokenType.ASSIGNMENT &&
			assignment.children.length === 2) {
				const prev = assignment.children[0];
				const after = assignment.children[1];
				if (typeof prev.val === 'string' && typeof after.val === 'string') {
					const val = parseFloat(after.val);
					if (isNumber(val))
						result[prev.val] = val;
				}
			}
		}
	}
	return result;
}