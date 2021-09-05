import { createArgList } from './createArgList.js';
import { getSortedLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const functionPrevTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB
]);
const functionEndTypes = new Set([
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_SUB
]);
const rangePrevTypes = new Set([
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.SHARED
]);
const grandParentTypesForExpectingParameterDataTypes = new Set([
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB
]);

function isEmptyArgList(token) {
	return token.type === ParseTreeTokenType.ARG_LIST &&
	token.children.length === 0;
}

function isExpectingParameterDataTypes(prev) {
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = prev.parentNode;
	if (parent.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const gParent = parent.parentNode;
	return grandParentTypesForExpectingParameterDataTypes.has(gParent.type);
}

function shouldConvertToFunctionCall(prev) {
	if (prev.type === ParseTreeTokenType.STEP && prev.children.length === 0)
		return true;
	if (prev.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (isExpectingParameterDataTypes(prev))
		return false;
	const parent = prev.parentNode;
	if (parent !== null) {
		if ((parent.type === ParseTreeTokenType.BINARY_OPERATOR ||
		parent.type === ParseTreeTokenType.ASSIGNMENT) &&
		parent.children.length < 2)
			return false;
		if (functionPrevTypes.has(parent.type) ||
		rangePrevTypes.has(parent.type))
			return false;
	}
	return true;
}

function shouldGetAddedToExistingArgList(prev) {
	if (prev.type !== ParseTreeTokenType.ARG_LIST ||
	prev.children.length !== 0)
		return false;
	const parent = prev.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	return true;
}

function shouldCreateArgList(prev) {
	if (!functionPrevTypes.has(prev.type))
		return false;
	const parent = prev.parentNode;
	if (parent !== null && functionEndTypes.has(parent.type))
		return false;
	
	return true;
}

function shouldCreateTupleLiteral(prev) {
	if (isEmptyArgList(prev))
		return false;
	const parent = prev.parentNode;
	const firstChild = prev.children[0];
	if (parent !== null) {
		if (prev.type === ParseTreeTokenType.BINARY_OPERATOR) {
			if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.TUPLE_LITERAL)
				return true;
		}
		else if (prev.type === ParseTreeTokenType.UNARY_OPERATOR) {
			if (firstChild === undefined &&
			parent.type === ParseTreeTokenType.ARG_LIST &&
			parent.children.length === 1)
				return true;
		}
	}
	return false;
}

function shouldCreateCurvedBracketExpression(prev) {
	if (prev.type === ParseTreeTokenType.ARG_LIST)
		return prev.children.length !== 0;

	return !shouldCreateTupleLiteral(prev);
}

function isGoodPreviousDown(token) {
	const children = token.children;
	if (children.length === 0 ||
	functionPrevTypes.has(token.type) ||
	rangePrevTypes.has(token.type))
		return true;
	const lastChild = children[children.length - 1];
	if (isExpectingParameterDataTypes(lastChild))
		return true;
	if (lastChild.type === ParseTreeTokenType.IDENTIFIER) {
		if ((token.type === ParseTreeTokenType.BINARY_OPERATOR ||
		token.type === ParseTreeTokenType.ASSIGNMENT) &&
		token.children.length === 1)
			return true;
		return false;
	}
	return true;
}

function getGoodPrevious(token) {
	if (token.type !== ParseTreeTokenType.TYPE_PROPERTY) {
		const last = getSortedLastDescendentTokenOf(token);
		if (shouldConvertToFunctionCall(last) ||
		shouldGetAddedToExistingArgList(last))
			return last;
		while (!isGoodPreviousDown(token))
			token = token.children[token.children.length - 1];
	}
	return token;
}

export function processCurvedLeftBracket(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldConvertToFunctionCall(prev)) {
		const funcCall = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
			ParseTreeTokenType.FUNCTION_CALL);
		prev.type = ParseTreeTokenType.IDENTIFIER; // it might be a STEP before conversion.
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, funcCall);
		prev.remove();
		funcCall.appendChild(prev);
		const argList = createArgList(next);
		funcCall.appendChild(argList);
		return argList;
	}
	else if (shouldCreateArgList(prev)) {
		const argList = createArgList(next);
		prev.appendChild(argList);
		return argList;
	}
	else if (shouldCreateCurvedBracketExpression(prev) ||
	shouldCreateTupleLiteral(prev)) {
		let type;
		if (shouldCreateCurvedBracketExpression(prev))
			type = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
		else
			type = ParseTreeTokenType.TUPLE_LITERAL;
		const newToken = new ParseTreeToken(null,
			next.lineIndex, next.colIndex, type);
		newToken.appendChild(next);
		prev.appendChild(newToken);
		return newToken;
	}
	prev.appendChild(next);
	return next;
};