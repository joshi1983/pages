import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const noCodeBlockPreviousTypes = new Set([
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

const badPreviousTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.EXCEPT,
	ParseTreeTokenType.FINALLY,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.SEMICOLON,
]);

function shouldAddCodeBlock(prev) {
	if (noCodeBlockPreviousTypes.has(prev.type))
		return false;
	return true;
}

function getNewTokenType(prev) {
	if (shouldAddCodeBlock(prev))
		return ParseTreeTokenType.CODE_BLOCK;
	else if (prev.type === ParseTreeTokenType.CLASS)
		return ParseTreeTokenType.CLASS_BODY;
}

function isGoodPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (badPreviousTypes.has(prev.type))
		return false;
	return true;
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processColon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	const newTokenType = getNewTokenType(prev);
	if (newTokenType !== undefined) {
		const newToken = new ParseTreeToken(null, next.lineIndex, next.colIndex, newTokenType);
		prev.appendChild(newToken);
		return newToken;
	}
	return prev;
};