import { ArrayUtils } from '../../../../../ArrayUtils.js';
import { filterBracketsAndCommas } from '../../../translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { isNumber } from '../../../../../isNumber.js';
import { memberp } from '../../../../../command-groups/helpers/memberp.js';

function isNumberOrString(val) {
	return isNumber(val) || typeof val === 'string';
}

function hasLength(val) {
	return ((typeof val === 'string') || val instanceof Array);
}

function isValidMemberpHayStack(val) {
	return hasLength(val);
}

export function getBinaryOperatorValue(token, tokenValues) {
	const childValueTokens = filterBracketsAndCommas(token.children);
	if (childValueTokens.length !== 2)
		return; // unable to calculate when invalid number of operands given.
	const operandValues = childValueTokens.map(child => tokenValues.get(child));

	// Process some cases that don't need both operand values before evaluation.
	if ((token.val === '/' || token.val === '//') && operandValues[0] === 0)
		return 0; // It doesn't matter what operandValues[1] is for this case.
	if (token.val === 'and' && (operandValues[0] === false || operandValues[1] === false))
		return false;
	if (token.val === 'or' && (operandValues[0] === true || operandValues[1] === true))
		return true;
	if (token.val === 'in' && hasLength(operandValues[1]) && (operandValues[1].length === 0))
		return false;
	if (token.val === 'not in' && hasLength(operandValues[1]) && (operandValues[1].length === 0))
		return true;
	/*
	0 * x and x * 0 usually resolves to 0 but that's only if x is a number.
	It can also return '' if x is a string.
	Since we don't know enough to return 0 or '', we can't return a result here.
	*/

	const areAllOperandsDefined = (operandValues.indexOf(undefined) === -1);
	if (!areAllOperandsDefined)
		return;
	let result;
	if (token.val === '+') {
		if (operandValues[0] instanceof Array && operandValues[1] instanceof Array)
			result = operandValues[0].concat(operandValues[1]);
		else if (isNumberOrString(operandValues[0]) && isNumberOrString(operandValues[1]))
			return operandValues[0] + operandValues[1];
	}
	else if (token.val === '-') {
		result = operandValues[0] - operandValues[1];
	}
	else if (token.val === '*') {
		if (typeof operandValues[1] === 'string' || operandValues[1] instanceof Array)
			operandValues.reverse(); // swap to get the non-number at [0].
			// since * is always symmetric in Python so swapping won't change the resulting value.

		if (typeof operandValues[0] === 'string' && Number.isInteger(operandValues[1]))
			return operandValues[0].repeat(operandValues[1]);
		else if (operandValues[0] instanceof Array && Number.isInteger(operandValues[1]))
			return ArrayUtils.repeat(operandValues[0], operandValues[1]);
		else
			result = operandValues[0] * operandValues[1];
	}
	else if (token.val === '/') {
		result = operandValues[0] / operandValues[1];
	}
	else if (token.val === '%') {
		result = operandValues[0] % operandValues[1];
	}
	else if (token.val === '>>') {
		result = operandValues[0] >> operandValues[1];
	}
	else if (token.val === '<<') {
		result = operandValues[0] << operandValues[1];
	}
	else if (token.val === 'and') {
		result = operandValues[0] && operandValues[1];
	}
	else if (token.val === 'or') {
		result = operandValues[0] || operandValues[1];
	}
	else if (token.val === 'in') {
		if (isValidMemberpHayStack(operandValues[1]))
			result = memberp(operandValues[0], operandValues[1]);
	}
	else if (token.val === 'not in') {
		if (isValidMemberpHayStack(operandValues[1]))
			result = !memberp(operandValues[0], operandValues[1]);
	}
	else if (token.val === '//') {
		result = Math.floor(operandValues[0] / operandValues[1]);
	}
	if (isNumber(result) || (typeof result === 'boolean') || (typeof result === 'string'))
		return result;
};