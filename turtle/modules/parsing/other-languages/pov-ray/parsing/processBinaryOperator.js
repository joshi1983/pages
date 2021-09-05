import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { isCompleteValueToken } from './isCompleteValueToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const possibleUnarySymbols = new Set(['-', '+']);

function isGoodPrev(token, possibleUnary) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (possibleUnary === false &&
	token.type === ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION &&
	parent.type === ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION) {
		return false;
	}
	if (isCompleteValueToken(token))
		return true;
	const expectedChildrenResult = hasAllExpectedChildren(token);
	if (possibleUnary && !ExpectedChildrenResult.canBeComplete(expectedChildrenResult))
		return true;
	if (expectedChildrenResult === ExpectedChildrenResult.TOO_FEW)
		return true;
	return false;
}

function getGoodPrevious(token, possibleUnary) {
	if (possibleUnary && token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	token.val === '=' && token.parentNode !== null &&
	token.children.length === 1) {
		const gParent = token.parentNode;
		if (gParent.type === ParseTreeTokenType.LOCAL ||
		gParent.type === ParseTreeTokenType.DECLARE)
			return token;
	}
	if (token.children.length !== 0) {
		let tok = token;
		while (tok.children.length !== 0) {
			tok = tok.children[tok.children.length - 1];
			if (isGoodPrev(tok))
				return tok;
		}
	}
	while (!isGoodPrev(token, possibleUnary))
		token = token.parentNode;
	return token;
}

function isPossiblyUnary(val) {
	return possibleUnarySymbols.has(val);
}

function isPossiblyUnaryPrevious(prev) {
	if (prev.type === ParseTreeTokenType.BINARY_OPERATOR &&
	prev.val === '=' && prev.parentNode !== null) {
		const gParent = prev.parentNode;
		if (gParent.type === ParseTreeTokenType.LOCAL ||
		gParent.type === ParseTreeTokenType.DECLARE)
			return true;
	}
	return !isCompleteValueToken(prev);
}

export function processBinaryOperator(prev, next) {
	const possibleUnary = isPossiblyUnary(next.val);
	prev = getGoodPrevious(prev, possibleUnary);
	const shouldUseUnary = possibleUnary && isPossiblyUnaryPrevious(prev);
	if (prev.parentNode === null || shouldUseUnary) {
		prev.appendChild(next);
		if (shouldUseUnary)
			next.type = ParseTreeTokenType.UNARY_OPERATOR;
	}
	else if (isCompleteValueToken(prev)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		next.appendChild(prev);
	}
	else {
		prev.appendChild(next);
	}
	if (next.children.length === 0 && next.type !== ParseTreeTokenType.UNARY_OPERATOR) {
		const previousSibling = next.getPreviousSibling();
		// See if we should add the first operand for the operator.
		if (previousSibling !== null && isCompleteValueToken(previousSibling)) {
			previousSibling.remove();
			next.appendChild(previousSibling);
		}
	}
	return next;
};