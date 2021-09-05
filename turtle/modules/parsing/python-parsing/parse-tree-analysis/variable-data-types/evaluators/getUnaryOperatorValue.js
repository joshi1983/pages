import { isNumber } from '../../../../../isNumber.js';

export function getUnaryOperatorValue(token, tokenValues) {
	const childValueTokens = token.children;
	if (childValueTokens.length !== 1)
		return; // unable to calculate when invalid number of operands given.
	const operandValue = tokenValues.get(childValueTokens[0]);
	if (operandValue === undefined)
		return;
	let result;
	if (token.val === '-')
		result = - operandValue;
	else if (token.val === 'not')
		result = !operandValue;
	if (isNumber(result) || typeof result === 'boolean')
		return result;
};