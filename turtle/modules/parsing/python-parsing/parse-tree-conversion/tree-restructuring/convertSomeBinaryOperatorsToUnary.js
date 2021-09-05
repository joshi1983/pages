import { convertChildren } from './helpers/convertChildren.js';
import { getUnaryBinaryPrev } from './helpers/getUnaryBinaryPrev.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isBinaryOperatorShouldBecomeUnary(token) {
	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	token.val !== '*' ||
	token.children.length > 1)
		return false;

	// if a previous token can be treated as a binary operand, return false.
	const prev = getUnaryBinaryPrev(token);
	if (prev !== undefined)
		return false;
	return true;
}

export function convertSomeBinaryOperatorsToUnary(token) {
	let result = false;
	if (isBinaryOperatorShouldBecomeUnary(token)) {
		token.type = ParseTreeTokenType.UNARY_OPERATOR;
		result = true;
	}
	if (convertChildren(token, convertSomeBinaryOperatorsToUnary))
		result = true;

	return result;
}