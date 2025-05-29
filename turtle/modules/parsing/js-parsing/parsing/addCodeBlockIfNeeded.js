import { isCodeBlockExpected } from './isCodeBlockExpected.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const codeBlockAppendChildTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.FINALLY,
	ParseTreeTokenType.STATIC,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.TRY
]);

const curlyPreviousTypes = new Set([
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.STATIC,
]);
const curlyLeftBracketTypesToSkip = new Set([
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.SEMICOLON
]);

function isCodeBlockExpectedForNextToken(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.ELSE &&
	nextToken.type === ParseTreeTokenType.IF)
		return false;
	if (isCodeBlockExpected(previousToken))
		return true;
	if (nextToken.type === ParseTreeTokenType.CURLY_LEFT_BRACKET) {
		while (curlyLeftBracketTypesToSkip.has(previousToken.type))
			previousToken = previousToken.parentNode;
		if (previousToken.val === '=>' && previousToken.children.length === 1)
			return true;
		if (curlyPreviousTypes.has(previousToken.type))
			return true;
	}
	return false;
}

function shouldAppendChild(previousToken) {
	if (previousToken.type === ParseTreeTokenType.BINARY_OPERATOR &&
	previousToken.val === '=>' &&
	previousToken.children.length === 1)
		return true;
	return codeBlockAppendChildTypes.has(previousToken.type);
}

function setPreviousParentCodeBlockIfNeeded(previousToken) {
	if (previousToken.parentNode === null ||
	previousToken.parentNode.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return;
	previousToken.parentNode.type = ParseTreeTokenType.CODE_BLOCK;
}

export function addCodeBlockIfNeeded(previousToken, nextToken) {
	if (isCodeBlockExpectedForNextToken(previousToken, nextToken)) {
		setPreviousParentCodeBlockIfNeeded(previousToken);
		const codeBlock = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CODE_BLOCK);
		codeBlock.appendChild(nextToken);
		if (shouldAppendChild(previousToken) || ((previousToken.type === ParseTreeTokenType.FUNCTION ||
		previousToken.type === ParseTreeTokenType.IDENTIFIER ||
		previousToken.type === ParseTreeTokenType.CATCH) && previousToken.children.length !== 0))
			previousToken.appendChild(codeBlock);
		else
			previousToken.appendSibling(codeBlock);
		return true;
	}
	return false;
};