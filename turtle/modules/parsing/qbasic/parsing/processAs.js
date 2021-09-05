import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.TYPE_PROPERTY,
]);

const dataTypeParentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.REDIM,
	ParseTreeTokenType.TYPE_PROPERTY,
]);

function shouldBeDirectlyInArgList(token) {
	if (token.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const functionNameToken = parent.children[0];
	if (functionNameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return functionNameToken.val.toLowerCase() === 'open';
}

function isGoodPreviousDown(token) {
	const children = token.children;
	if (children.length === 0)
		return true;
	if (shouldBeDirectlyInArgList(token))
		return true;
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPreviousDown(token)) {
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
}

function shouldPrecedeDataType(token) {
	if (token.type === ParseTreeTokenType.ARG_LIST) {
		const parent = token.parentNode;
		
		if (parent.type === ParseTreeTokenType.FUNCTION_CALL)
			return false;
	}
	if (dataTypeParentTypes.has(token.type))
		return true;
	return false;
}

export function processAs(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	if (shouldPrecedeDataType(prev)) {
		const dt = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.DATA_TYPE)
		next.appendChild(dt);
		return dt;
	}
	return next;
};