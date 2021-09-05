import { evaluateLiteralToken } from
'../../../evaluators/evaluateLiteralToken.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const assignOperators = new Set([
ParseTreeTokenType.ASSIGNMENT_OPERATOR,
ParseTreeTokenType.UNARY_OPERATOR
]);

function getOperatorFrom(token) {
	while (!assignOperators.has(token.type) && token.children.length !== 0)
		token = token.children[0];
	if (assignOperators.has(token.type))
		return token;
}

function getIncrementAmountFromIncrementStepToken(token) {
	if (token.type === ParseTreeTokenType.FOR_LOOP_INSTRUCTIONS) {
		return;
	}
	const op = getOperatorFrom(token);
	if (op !== undefined) {
		if (op.val === '++')
			return 1;
		if (op.val === '--')
			return -1;
		if (op.val === '+=' || op.val === '-=') {
			if (op.children.length === 2) {
				const val = evaluateLiteralToken(op.children[1]);
				if (isNumber(val)) {
					if (op.val === '+=')
						return val;
					else
						return -val;
				}
			}
		}
	}
	else if (token.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return 0;
}

export function getIncrementAmountFromForToken(forToken) {
	if (forToken.children.length !== 0) {
		const settingsToken = forToken.children[0];
		const incrementStepToken = settingsToken.children[5];
		if (incrementStepToken !== undefined) {
			return getIncrementAmountFromIncrementStepToken(incrementStepToken);
		}
	}
};