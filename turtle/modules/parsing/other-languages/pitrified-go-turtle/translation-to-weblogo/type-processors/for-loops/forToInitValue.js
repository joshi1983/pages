import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { forToInitToken } from
'./forToInitToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function forToInitValue(forToken) {
	const initToken = forToInitToken(forToken);
	if (initToken === undefined)
		return;
	if (initToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	(initToken.val === '=' || initToken.val === ':=')) {
		const rightOperand = initToken.children[1];
		if (rightOperand !== undefined) {
			if (rightOperand.type === ParseTreeTokenType.RANGE)
				return 0;
			return evaluateToken(rightOperand);
		}
	}
};