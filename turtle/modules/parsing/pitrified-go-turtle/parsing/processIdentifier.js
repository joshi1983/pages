import { isComplete } from
'./isCompleteWithNext.js';
import { MaybeDecided } from
'../../../MaybeDecided.js';
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
	
	if (isComplete(prev) === MaybeDecided.Yes)
		return false;

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
	if (prev.type === ParseTreeTokenType.IDENTIFIER) {
		if (lastChild !== undefined &&
		lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return false;
		if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY)
			return false;
	}
	if (prev.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY && children.length >= 3)
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

	return prev;
}

function shouldCreateDataTypeExpression(prev, next) {
	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (prev.type === ParseTreeTokenType.ARRAY_LITERAL && lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.ARRAY_SUBSCRIPT) {
		return true;
	}
	const prevParent = prev.parentNode;
	if (prev.type === ParseTreeTokenType.IDENTIFIER) {
		if (prevParent.type === ParseTreeTokenType.STRUCT ||
		prevParent.type === ParseTreeTokenType.TYPE)
			return true;
		if (prevParent.type === ParseTreeTokenType.TYPE_PARAMETERS)
			return true;

		if (prevParent.type === ParseTreeTokenType.ARG_LIST) {
			if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
				return false; // the variable already has a corresponding data type so no need to make a new one.

			const grandparent = prevParent.parentNode;
			if (grandparent.type === ParseTreeTokenType.FUNC)
				return true;
		}
		if (prevParent.type === ParseTreeTokenType.CONST || prevParent.type === ParseTreeTokenType.VAR) {
			return true;
		}
	}
	if (prev.type === ParseTreeTokenType.CHAN)
		return true;
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
		let dtePositionToken = next;
		if (prev.type === ParseTreeTokenType.CHAN) {
			dtePositionToken = prev;
			prev = prev.parentNode;
		}
		const e = new ParseTreeToken(null, dtePositionToken.lineIndex, dtePositionToken.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
		if (dtePositionToken !== next) {
			dtePositionToken.remove();
			e.appendChild(dtePositionToken);
		}
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
		if (prev.type === ParseTreeTokenType.CHAN) {
			return prev.parentNode;
		}
		return next;
	}
};