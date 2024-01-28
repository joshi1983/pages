import { convertChildren } from './helpers/convertChildren.js';
import { invalidOperandTokenTypes } from './helpers/invalidOperandTokenTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isBinaryOperatorThatNeedsChildren(token) {
	return token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.children.length === 0 &&
	token.parentNode !== null &&
	token.parentNode.parentNode !== null &&
	token.parentNode.children.length >= 3 &&
	token.parentNode.children.indexOf(token) === 1 &&
	!invalidOperandTokenTypes.has(token.parentNode.children[0].type) &&
	!invalidOperandTokenTypes.has(token.parentNode.children[1].type);
}

function giveBinaryOperatorChildren(token) {
	const parent = token.parentNode;
	const prev = parent.children[0];
	const next = parent.children[2];
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