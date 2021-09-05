import { convertChildren } from './helpers/convertChildren.js';
import { isGoodBinaryPrevious } from './helpers/getUnaryBinaryPrev.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isBinaryOperatorThatNeedsChildren(token) {
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.children.length === 0 &&
	parent !== null &&
	parent.parentNode !== null &&
	parent.children.length >= 3) {
		const index = parent.children.indexOf(token);
		if (index !== 0) {
			if (index === parent.children.length - 1)
				return false;
			if (isGoodBinaryPrevious(parent.children[index - 1]))
				return true;
		}
	}
	return false;
}

function giveBinaryOperatorChildren(token) {
	const parent = token.parentNode;
	const index = parent.children.indexOf(token);
	const prev = parent.children[index - 1];
	const next = parent.children[index + 1];
	token.appendChild(prev);
	token.appendChild(next);
	if (parent.parentNode !== null && parent.children.length === 1)
		parent.parentNode.replaceChild(parent, token);
}

export function convertBinaryOperatorStructures(token) {
	let result = false;
	const parent = token.parentNode;
	if (isBinaryOperatorThatNeedsChildren(token)) {
		giveBinaryOperatorChildren(token);
		result = true;
	}
	else if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parent !== null &&
	parent.type === ParseTreeTokenType.UNRECOGNIZED &&
	parent.children.length === 3 &&
	token.val === null &&
	token.children.length === 1 &&
	parent.children.indexOf(token) === 1) {
		const opSymbol = token.children[0].val;
		parent.removeChild(token);
		parent.type = ParseTreeTokenType.BINARY_OPERATOR;
		parent.val = opSymbol;
		result = true;
	}
	if (convertChildren(token, convertBinaryOperatorStructures))
		result = true;

	return result;
};