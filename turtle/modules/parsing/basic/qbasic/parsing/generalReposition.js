import { isDefAssignment } from './isDefAssignment.js';
import { isMismatchedArgListKeyword } from './isMismatchedArgListKeyword.js';
import { mightBeComplete } from './mightBeComplete.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../QBasicInternalFunctions.js';

const codeBlockChildTypes = new Set([
	ParseTreeTokenType.CALL,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.ON,
	ParseTreeTokenType.RETURN,
]);

const valueTokenTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
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
	const parent = token.parentNode;
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.CASE) {
		if (isFirstSelectCase(token))
			return false;
		return true;
	}
	else if (token.type === ParseTreeTokenType.DEF) {
		if (isDefAssignment(token))
			return false;
		return token.children.length === 2;
	}
	else if (token.type === ParseTreeTokenType.DO &&
	children.length === 0)
		return true;
	else if (token.type === ParseTreeTokenType.FOR) {
		if (children.length >= 1) {
			if (lastChild.type === ParseTreeTokenType.STEP) {
				return lastChild.children.length !== 0;
			}
			if (lastChild.type === ParseTreeTokenType.BINARY_OPERATOR &&
			lastChild.children.length === 2) {
				return true;
			}
		}
	}
	else if (token.type === ParseTreeTokenType.IF &&
	token.children.length === 1)
		return true;
	else if (token.type === ParseTreeTokenType.WHILE &&
	parent.type !== ParseTreeTokenType.LOOP_WHILE &&
	mightBeComplete(lastChild) &&
	children.length === 1) {
		return true;
	}
	else if (token.type === ParseTreeTokenType.SUB ||
	token.type === ParseTreeTokenType.FUNCTION)
		return true;
	return false;
}

function shouldMoveUpAfterReturnStatement(prev, next) {
	if (prev.type !== ParseTreeTokenType.RETURN)
		return false;
	const parent = prev.parentNode;
	if (parent.lineIndex === prev.lineIndex && next.lineIndex !== prev.lineIndex)
		return true;
	if (next.type === ParseTreeTokenType.IDENTIFIER) {
		const info = QBasicInternalFunctions.getFunctionInfo(next.val);
		if (info !== undefined && info.returnTypes === null) {
			return true;
		}
	}
	return false;
}

function repositionAfterReturnStatement(prev, next) {
	if (shouldMoveUpAfterReturnStatement(prev, next)) {
		const parent = prev.parentNode;
		if (parent !== null && parent.lineIndex === prev.lineIndex) {
			const grandParent = parent.parentNode;
			if (grandParent !== null && grandParent.lineIndex === prev.lineIndex)
				return grandParent; // treat like a single line if statement.
		}
		return parent;
	}
	return prev;
}

function shouldMoveUpAfterSingleLineIfStatement(prev, next) {
	if (prev.type !== ParseTreeTokenType.CODE_BLOCK ||
	next.type === ParseTreeTokenType.END ||
	next.lineIndex === prev.lineIndex ||
	prev.children.length !== 1)
		return false;
	const prevChild = prev.children[0];
	if (prevChild.lineIndex !== prev.lineIndex)
		return false;

	const parent = prev.parentNode;
	if (parent.type === ParseTreeTokenType.IF &&
	parent.children.indexOf(prev) === 2 &&
	parent.lineIndex !== next.lineIndex) {
		return true;
	}
	return false;
}

function repositionAfterSingleLineIfStatement(prev, next) {
	if (shouldMoveUpAfterSingleLineIfStatement(prev, next))
		return prev.parentNode.parentNode;

	return prev;
}

function isTypeOnLabel(prev, next) {
	return prev.type === ParseTreeTokenType.TYPE &&
		next.type === ParseTreeTokenType.LABEL;
}

function isFirstSelectCase(token) {
	if (token.type !== ParseTreeTokenType.CASE)
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.SELECT)
		return false;
	return parent.children[0] === token;
}

function repositionCodeBlockChildToken(prev, next) {
	if (codeBlockChildTypes.has(next.type)) {
		while (prev.parentNode !== null &&
		prev.type !== ParseTreeTokenType.CODE_BLOCK &&
		prev.type !== ParseTreeTokenType.DO_UNTIL &&
		prev.type !== ParseTreeTokenType.SELECT &&
		!isTypeOnLabel(prev, next) &&
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
	repositionAfterReturnStatement,
	repositionAfterSingleLineIfStatement,
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