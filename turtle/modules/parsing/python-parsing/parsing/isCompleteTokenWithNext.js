import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const joiningTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.IN
]);

function isArgumentListComplete(prev, next) {
	const prevChildren = prev.children;
	if (prevChildren.length === 0)
		return false;
	const first = prevChildren[0];
	if (first.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return prevChildren[prevChildren.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;

	return !joiningTypes.has(next.type);
}

function isIdentifierComplete(prev, next) {
	if (prev.parentNode.type === ParseTreeTokenType.CLASS)
		return true;
	if (prev.children.length === 0) {
		if (next.type === ParseTreeTokenType.DOT ||
		next.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return false;
		if (prev.val === 'print')
			return false;
	}
	return true;
}

const checkers = new Map([
	[ParseTreeTokenType.ARGUMENT_LIST, isArgumentListComplete],
	[ParseTreeTokenType.IDENTIFIER, isIdentifierComplete]
]);

export function isCompleteTokenWithNext(prev, next) {
	const checker = checkers.get(prev.type);
	if (checker !== undefined)
		return checker(prev, next);

	return isCompleteToken(prev);
};