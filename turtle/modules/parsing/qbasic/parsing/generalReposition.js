import { isMismatchedArgListKeyword } from './isMismatchedArgListKeyword.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const codeBlockChildTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.ON,
	ParseTreeTokenType.RETURN,
]);

const valueTokenTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);
const badValuePreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);
const valuePreviousStopTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR
]);

function repositionArgListKeyword(prev, next) {
	if (isMismatchedArgListKeyword(prev, next))
		prev = prev.parentNode;
	return prev;
}

function getForLoopVariableName(forToken) {
	const toToken = forToken.children[0];
	if (toToken === undefined)
		return;
	const initToken = toToken.children[0];
	if (initToken === undefined)
		return;
	const varNameToken = initToken.children[0];
	if (varNameToken === undefined ||
	varNameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return;
	return varNameToken.val.toLowerCase();
}

/*
For-loops in QBasic typically end with NEXT {for-loop counter variable name}.
We also want to handle cases where the variable name is not specified after "NEXT".
The following function checks that next token matches the name of the corresponding for-loop.
If no, the parent of the for-loop is returned instead of prev.
This helps the parser add whatever the next token is immediately after the for-loop 
instead of incorrectly adding it as a child of the NEXT keyword.
*/
function repositionNextChild(prev, next) {
	if (prev.type !== ParseTreeTokenType.NEXT)
		return prev;

	const parent = prev.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.FOR)
		return prev;

	const gParent = parent.parentNode;
	if (gParent === null)
		return prev;

	if (next.type !== ParseTreeTokenType.IDENTIFIER)
		return gParent;

	const forLoopVariableName = getForLoopVariableName(parent);
	if (forLoopVariableName !== undefined &&
	forLoopVariableName !== next.val.toLowerCase())
		return gParent;

	return prev;
}

function isExpectingToAddCodeBlock(token) {
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.FOR &&
	children.length >= 1) {
		if (lastChild.type === ParseTreeTokenType.STEP) {
			return lastChild.children.length !== 0;
		}
		if (lastChild.type === ParseTreeTokenType.BINARY_OPERATOR &&
		lastChild.val.toLowerCase() === 2) {
			return true;
		}
	}
	return false;
}

function repositionCodeBlockChildToken(prev, next) {
	if (codeBlockChildTypes.has(next.type)) {
		while (prev.parentNode !== null &&
		prev.type !== ParseTreeTokenType.CODE_BLOCK &&
		!isExpectingToAddCodeBlock(prev))
			prev = prev.parentNode;
	}
	return prev;
}

function repositionValueToken(prev, next) {
	if (valueTokenTypes.has(next.type) && prev.children.length !== 0) {
		let lastChild;
		while (true) {
			const parent = prev.parentNode;
			if (parent === null || valuePreviousStopTypes.has(parent.type) ||
			valuePreviousStopTypes.has(prev.type))
				break;
			const prevChildren = prev.children;
			const lastChild = prevChildren[prevChildren.length - 1];
			if (!badValuePreviousTypes.has(lastChild.type))
				break;
			prev = parent;
		}
	}
	return prev;
}

const repositioners = [
	repositionArgListKeyword,
	repositionCodeBlockChildToken,
	repositionNextChild,
	repositionValueToken
];

export function generalReposition(prev, next) {
	for (const repositioner of repositioners) {
		prev = repositioner(prev, next);
	}
	return prev;
};