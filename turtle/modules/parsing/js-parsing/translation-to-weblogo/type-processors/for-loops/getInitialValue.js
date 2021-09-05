import { declaringTypes } from
'../../../parsing/declaringTypes.js';
import { evaluateLiteralToken } from
'../../../evaluators/evaluateLiteralToken.js';
import { getInitialToken } from './getInitialToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function getValueFromAssignToken(assignToken) {
	if (assignToken.val !== '=')
		return;
	if (assignToken.children.length === 2) {
		return evaluateLiteralToken(assignToken.children[1]);
	}
}

function getInitialValueFromInitToken(initToken) {
	if (declaringTypes.has(initToken.type)) {
		const child = initToken.children[0];
		if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
			return getValueFromAssignToken(child);
	}
	else if (initToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		return getValueFromAssignToken(initToken);
	}
}

export function getInitialValue(forToken) {
	const initToken = getInitialToken(forToken);
	if (initToken !== undefined) {
		const potentialResult = getInitialValueFromInitToken(initToken);
		if (potentialResult !== undefined)
			return potentialResult;
	}
};