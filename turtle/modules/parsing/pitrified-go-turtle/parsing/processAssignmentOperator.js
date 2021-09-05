import { isPossibleData } from './isPossibleData.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.COMMA_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT_PROPERTY,
	ParseTreeTokenType.IDENTIFIER
]);

const lookDownTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

function isLikelyUnary(next) {
	const info = Operators.getOperatorInfo(next.val);
	if (info.isNotBinary)
		return true;
	return false;
}

function getGoodPrevious(prev) {
	const children = prev.children;
	const last = children[children.length - 1];
	if (lookDownTypes.has(prev.type) && last !== undefined) {
		if (last.type === ParseTreeTokenType.IDENTIFIER ||
		last.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
			return last;
	}
	while (prev.parentNode !== null &&
	prev.parentNode.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
	prev.parentNode.children.length === 3)
		prev = prev.parentNode;
	const parent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		if (parent.type === ParseTreeTokenType.IDENTIFIER) {
			return parent;
		}
	}
	if (isPossibleData(prev) && parent.type === ParseTreeTokenType.COMMA_EXPRESSION)
		return parent;
	return prev;
}

export function processAssignmentOperator(prev, next) {
	prev = getGoodPrevious(prev);
	if (goodPreviousTypes.has(prev.type) && !isLikelyUnary(next)) {
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, next);
		prev.remove();
		next.appendChild(prev);
	}
	else { 
		// weird case.  Something went wrong.  Likely a syntax error.
		// We want to include the next in the parse tree even if that makes the parse tree represent bad code.
		prev.appendChild(next);
	}
	return next;
};