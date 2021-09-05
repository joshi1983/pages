import { convertChildren } from './helpers/convertChildren.js';
import { binaryPreviousTypes, getUnaryBinaryPrev } from './helpers/getUnaryBinaryPrev.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function getNext(token) {
	while (token.parentNode !== null) {
		const next = token.getNextSibling();
		if (next !== null) {
			return next;
		}
	}
}

export function isUnaryOperatorShouldBecomeBinary(token) {
	if (token.type !== ParseTreeTokenType.UNARY_OPERATOR ||
	token.val !== '-' || token.children.length > 1)
		return false;
	const c = getUnaryBinaryPrev(token);
	if (c === undefined)
		return false;
	if (binaryPreviousTypes.has(c.type))
		return true;
	return false;
};

export function convertSomeUnaryOperatorsToBinary(token) {
	let result = false;
	if (isUnaryOperatorShouldBecomeBinary(token)) {
		const prev = getUnaryBinaryPrev(token);
		token.type = ParseTreeTokenType.BINARY_OPERATOR;
		prev.remove();
		token.insertAsFirstChild(prev);
		if (token.children.length === 1) {
			const next = getNext(token);
			if (next !== undefined)
				token.appendChild(next);
		}
		result = true;
	}
	if (convertChildren(token, convertSomeUnaryOperatorsToBinary))
		result = true;

	return result;
};