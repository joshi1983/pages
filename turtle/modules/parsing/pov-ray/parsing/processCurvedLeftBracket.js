import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PovRayCommand } from '../PovRayCommand.js';

const curvedBracketPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.IFDEF,
	ParseTreeTokenType.IFNDEF,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.WHILE
]);

function getBestTypeFromPrevious(prev) {
	const parent = prev.parentNode;
	if (parent !== null && (parent.type === ParseTreeTokenType.DECLARE ||
	parent.type === ParseTreeTokenType.LOCAL))
		return ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
	if (curvedBracketPreviousTypes.has(prev.type)) {
		return ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
	}
	return ParseTreeTokenType.ARG_LIST;
}

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
		return false;
	if (curvedBracketPreviousTypes.has(token.type))
		return true;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = PovRayCommand.getCommandInfo(token.val);
		if (info !== undefined && info.args !== undefined && info.args.length !== 0)
			return true;
	}
	return false;
}

function getGoodPrevious(token, bestType) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.parentNode.type === ParseTreeTokenType.MACRO)
		return token.parentNode;
	if (bestType === ParseTreeTokenType.ARG_LIST)
		return token;
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCurvedLeftBracket(prev, next) {
	const type = getBestTypeFromPrevious(prev);
	const e = new ParseTreeToken(null, next.lineIndex, next.colIndex, type);
	prev = getGoodPrevious(prev, type);
	prev.appendChild(e);
	e.appendChild(next);
	return e;
};