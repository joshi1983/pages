import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesNeedingCodeBlocks = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.FAT_ARROW,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.WHILE
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

function doesIdentifierNeedCodeBlock(prev, next) {
	if (next.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
		return false;
	const prevParent = prev.parentNode;
	if (prevParent.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	return true;
}

function doesIfNeedCodeBlock(prev) {
	const children = prev.children;
	if (children.length === 0)
		return false; // condition needed before code block so no.
	return true;
}

function doesWhileNeedCodeBlock(prev) {
	const children = prev.children;
	if (children.length === 0)
		return false; // condition needed before code block so no.
	return true;
}

const codeBlockNeededMap = new Map([
	[ParseTreeTokenType.DEF, doesDefNeedCodeBlock],
	[ParseTreeTokenType.ELSE, doesElseNeedCodeBlock],
	[ParseTreeTokenType.FAT_ARROW, doesFatArrowNeedCodeBlock],
	[ParseTreeTokenType.FOR, doesForNeedCodeBlock],
	[ParseTreeTokenType.IDENTIFIER, doesIdentifierNeedCodeBlock],
	[ParseTreeTokenType.IF, doesIfNeedCodeBlock],
	[ParseTreeTokenType.WHILE, doesWhileNeedCodeBlock]
]);

function isCodeBlockNeeded(prev, next) {
	if (!typesNeedingCodeBlocks.has(prev.type))
		return false;

	const children = prev.children;
	const existingCodeBlock = children.some(t => t.type === ParseTreeTokenType.CODE_BLOCK);
	if (existingCodeBlock)
		return false;

	const checker = codeBlockNeededMap.get(prev.type);
	if (checker !== undefined)
		return checker(prev, next);

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