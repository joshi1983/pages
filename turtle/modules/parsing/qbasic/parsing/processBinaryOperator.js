import { convertArgListToExpression } from
'./convertArgListToExpression.js';
import { isArgListToConvertToExpression } from
'./isArgListToConvertToExpression.js';
import { isComplete } from
'./isComplete.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../QBasicInternalFunctions.js';
import { shouldBecomeAssignment } from
'./shouldBecomeAssignment.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SELECT,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.TYPE,
	ParseTreeTokenType.WHILE,
]);

const goodPreviousTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.TUPLE_LITERAL,
]);

const identifierPrevTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.SEMICOLON
]);

function shouldBecomeIdentifier(prev) {
	return identifierPrevTypes.has(prev.type);
}

function isGoodPreviousUp(token, next, functionsMap) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT &&
	parent.children.length === 3 &&
	token.type === ParseTreeTokenType.IDENTIFIER)
		return false;
	const children = token.children;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.ARG_LIST &&
	parent.type === ParseTreeTokenType.FUNCTION_CALL) {
		if (isComplete(token, functionsMap))
			return false;
		if (next.val === '=' &&
		firstChild !== undefined &&
		firstChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
		lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			return false;
	}

	return true;
}

function isFunctionCallReturningNull(token, functionsMap) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const children = token.children;
	const firstChild = children[0];
	const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val.toLowerCase(), functionsMap);
	if (info !== undefined) {
		if (info.returnTypes === null)
			return true;
	}
	return false;
}

function isGoodPrevious(token, functionsMap) {
	if (!isComplete(token))
		return false;
	if (isFunctionCallReturningNull(token, functionsMap))
		return false;
	if (isArgListToConvertToExpression(token))
		return true;
	return goodPreviousTypes.has(token.type);
}

function isGoodPreviousDown(token, functionsMap) {
	const children = token.children;
	if (children.length === 0 ||
	isGoodPrevious(token, functionsMap))
		return true;
	if (badPreviousTypes.has(token.type))
		return false;
	if (isFunctionCallReturningNull(token, functionsMap))
		return false;
	const lastChild = children[children.length - 1];
	if (isGoodPrevious(lastChild, functionsMap))
		return false;
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
		return false;
	}
	return false;
}

function getGoodPrevious(token, next, functionsMap) {
	while (!isGoodPreviousUp(token, next, functionsMap)) {
		token = token.parentNode;
	}
	while (!isGoodPreviousDown(token, functionsMap)) {
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
}

function convertToTuple(prev, next) {
	const parent = prev.parentNode;
	const children = parent.children;
	const rightIndex = children.indexOf(prev) - 1;
	for (let index = rightIndex - 1; index >= 0; index--) {
		const token = children[index];
		if (token.type === ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			const tupleToken = new ParseTreeToken(null, token.lineIndex, token.colIndex,
				ParseTreeTokenType.TUPLE_LITERAL);
			while (index < children.length) {
				const tupleChild = children[index];
				tupleChild.remove();
				tupleToken.appendChild(tupleChild);
			}
			parent.appendChild(tupleToken);
			return tupleToken;
		}
	}
}

export function processBinaryOperator(prev, next, functionsMap) {
	prev = getGoodPrevious(prev, next, functionsMap);
	let parent = prev.parentNode;
	if (parent === null) {
		prev.appendChild(next);
		return next;
	}
	if (isArgListToConvertToExpression(prev)) {
		prev = convertArgListToExpression(prev);
		parent = prev.parentNode;
	}
	else if (prev.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET &&
	parent.type === ParseTreeTokenType.ARG_LIST) {
		const tuple = convertToTuple(prev, next);
		if (tuple !== undefined)
			prev = tuple;
	}
	else if (shouldBecomeIdentifier(prev)) {
		next.type = ParseTreeTokenType.IDENTIFIER;
		parent.appendChild(next);
		return parent;
	}
	parent.replaceChild(prev, next);
	next.appendChild(prev);
	if (shouldBecomeAssignment(next))
		next.type = ParseTreeTokenType.ASSIGNMENT;
	return next;
};