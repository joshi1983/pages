import { evaluateLiteralToken } from '../../../evaluators/evaluateLiteralToken.js';
import { getConditionToken } from './getConditionToken.js';
import { isNumber } from '../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const comparisonOperators = new Set([
'<', '>', '===', '==', '!==', '!=', '>=', '<='
]);

function getLimitFromLimitToken(limitToken) {
	if (limitToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
	comparisonOperators.has(limitToken.val)) {
		const children = limitToken.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const val = evaluateLiteralToken(child);
			if (isNumber(val)) {
				return val;
			}
		}
	}
}

export function getLimitFromForToken(forToken) {
	const conditionToken = getConditionToken(forToken);
	if (conditionToken !== undefined) {
		const potentialResult = getLimitFromLimitToken(conditionToken);
		if (isNumber(potentialResult))
			return potentialResult;
	}
};