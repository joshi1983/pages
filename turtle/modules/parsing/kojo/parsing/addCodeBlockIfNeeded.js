import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesNeedingCodeBlocks = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FAT_ARROW,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.FOR
]);

function doesDefNeedCodeBlock(prev, next) {
	const children = prev.children;
	if (children.length === 0)
		return false; // name needed before code block so no.
	if (next.type === ParseTreeTokenType.CURLY_LEFT_BRACKET)
		return true;
	const lastChild  = children[children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	return true;
}

function doesElseNeedCodeBlock(prev, next) {
	if (next.type === ParseTreeTokenType.IF)
		return false;
	return true;
}

function doesFatArrowNeedCodeBlock(prev, next) {
	return prev.children.length <= 1;
}

function doesForNeedCodeBlock(prev, next) {
	return prev.children.length !== 0;
}

function doesIfNeedCodeBlock(prev) {
	const children = prev.children;
	if (children.length === 0)
		return false; // condition needed before code block so no.
	return true;
}

function isCodeBlockNeeded(prev, next) {
	if (!typesNeedingCodeBlocks.has(prev.type))
		return false;

	const children = prev.children;
	const existingCodeBlock = children.some(t => t.type === ParseTreeTokenType.CODE_BLOCK);
	if (existingCodeBlock)
		return false;

	if (prev.type === ParseTreeTokenType.DEF)
		return doesDefNeedCodeBlock(prev, next);
	else if (prev.type === ParseTreeTokenType.ELSE)
		return doesElseNeedCodeBlock(prev, next);
	else if (prev.type === ParseTreeTokenType.FAT_ARROW)
		return doesFatArrowNeedCodeBlock(prev, next);
	else if (prev.type === ParseTreeTokenType.FOR)
		return doesForNeedCodeBlock(prev, next);
	else if (prev.type === ParseTreeTokenType.IF)
		return doesIfNeedCodeBlock(prev);

	return true;
}

function addCodeBlock(prev, next) {
	const codeBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.CODE_BLOCK);
	prev.appendChild(codeBlock);
	return codeBlock;
}

export function addCodeBlockIfNeeded(prev, next) {
	if (isCodeBlockNeeded(prev, next)) {
		return addCodeBlock(prev, next);
	}
	return prev;
};