import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { isTokenBeforeClassMethodCodeBlock } from './isTokenBeforeClassMethodCodeBlock.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const codeBlockParentTypes = new Set([
	ParseTreeTokenType.IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.WHILE
]);

const codeBlockPreviousTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.FINALLY,
	ParseTreeTokenType.TRY
]);

function endsWithCompleteArgList(token) {
	if (token.children.length === 0)
		return false;
	const lastChild = token.children[token.children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	return endsWithClosingCurvedBracket(lastChild);
}

function isArgListForFunctionDefinition(token) {
	if (endsWithCompleteArgList(token)) {
		if (token.type === ParseTreeTokenType.FUNCTION)
			return true;
		const parent = token.parentNode;
		if (token.type === ParseTreeTokenType.IDENTIFIER &&
		(parent.type === ParseTreeTokenType.CLASS_BODY ||
		parent.type === ParseTreeTokenType.ASYNC ||
		parent.type === ParseTreeTokenType.STATIC))
			return true;
	}
	if (token.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	if (token.parentNode.type !== ParseTreeTokenType.FUNCTION)
		return false;
	return true;
}

function isArgListForCatch(token) {
	if (token.type === ParseTreeTokenType.CATCH &&
	endsWithCompleteArgList(token))
		return true;
	return token.type === ParseTreeTokenType.ARG_LIST &&
		token.parentNode !== null &&
		token.parentNode.type === ParseTreeTokenType.CATCH;
}

function isSwitchCaseEnded(token) {
	if (token.type !== ParseTreeTokenType.COLON || token.parentNode === null)
		return false;
	if (token.parentNode.type === ParseTreeTokenType.CASE ||
	token.parentNode.type === ParseTreeTokenType.DEFAULT)
		return true;
	return false;
}

function isWithStatementSettings(token) {
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION && token.parentNode.type === ParseTreeTokenType.WITH)
		return true;
	return false;
}

export function isCodeBlockExpected(token) {
	const lastChild = token.children[token.children.length - 1];
	if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.CODE_BLOCK)
		return false;
	if (isArgListForFunctionDefinition(token) || token.type === ParseTreeTokenType.FOR_LOOP_SETTINGS)
		return true;
	if (isArgListForCatch(token))
		return true;
	if (isSwitchCaseEnded(token))
		return true;
	if (isWithStatementSettings(token))
		return true;
	if (isTokenBeforeClassMethodCodeBlock(token))
		return true;
	if (codeBlockPreviousTypes.has(token.type))
		return token.children.length === 0;
	if (token.parentNode !== null && codeBlockParentTypes.has(token.parentNode.type) &&
	token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return true;
	return false;
};