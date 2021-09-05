import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.STRING_LITERAL
]);

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	
	if (prev.type === ParseTreeTokenType.IMPORT &&
	prev.children.length !== 0) {
		return false;
	}

	return !badPreviousTypes.has(prev.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	
	return prev;
}

function shouldCreateDataTypeExpression(prev, next) {
	if (prev.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = prev.parentNode;
		if (parent.type === ParseTreeTokenType.VAR || parent.type === ParseTreeTokenType.ARG_LIST)
			return true;
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
	prev = getGoodPrevious(prev);
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