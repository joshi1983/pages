import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.STRING_LITERAL
]);

function isGoodPrevious(prev, next) {
	const parent = prev.parentNode;
	if (parent === null)
		return true;

	const children = prev.children;
	if (prev.type === ParseTreeTokenType.IMPORT &&
	children.length !== 0) {
		return false;
	}
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.IDENTIFIER)
			return false;
	}
	if (prev.type === ParseTreeTokenType.IDENTIFIER && lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return false;
	if (prev.type === ParseTreeTokenType.CONST || prev.type === ParseTreeTokenType.VAR) {
		if (prev.lineIndex !== next.lineIndex)
			return false;
	}

	return !badPreviousTypes.has(prev.type);
}

function getGoodPrevious(prev, next) {
	while (!isGoodPrevious(prev, next))
		prev = prev.parentNode;

	if (prev.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY &&
	prev.children.length === 2)
		return prev;

	// if in a STRUCT and not likely a data type, prev should be the struct.
	const closestStruct = getClosestOfType(prev, ParseTreeTokenType.STRUCT);
	if (closestStruct !== null && closestStruct !== prev.parentNode) {
		const closestDataType = getClosestOfType(prev, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		if (closestDataType === null)
			return closestStruct;
	}

	return prev;
}

function shouldCreateDataTypeExpression(prev, next) {
	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL && lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.ARRAY_SUBSCRIPT) {
		return true;
	}
	if (prev.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = prev.parentNode;
		if (parent.type === ParseTreeTokenType.CONST || parent.type === ParseTreeTokenType.VAR ||
		parent.type === ParseTreeTokenType.ARG_LIST) {
			if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
				return false; // the variable already has a corresponding data type so no need to make a new one.
			return true;
		}
	}
	return false;
}

function shouldCreateEmptyDataTypeExpression(identifier) {
	const parent = identifier.parentNode;
	if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const grandParent = parent.parentNode;
		if (grandParent.type === ParseTreeTokenType.FUNC)
			return true;
	}
	return false;
}

export function processIdentifier(prev, next) {
	prev = getGoodPrevious(prev, next);
	if (shouldCreateDataTypeExpression(prev, next)) {
		const e = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		e.appendChild(next);
		prev.appendChild(e);
		return e;
	}
	else {
		prev.appendChild(next);
		if (shouldCreateEmptyDataTypeExpression(next)) {
			const e = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
			next.appendChild(e);
			return e;
		}
		return next;
	}
};