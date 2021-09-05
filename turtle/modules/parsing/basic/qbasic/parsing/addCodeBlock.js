import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const prevTypesToAppendCodeBlock = new Set([
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.IF,
	ParseTreeTokenType.SUB,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.WHILE
]);

function isGoodPreviousUp(token, next) {
	if (token.parentNode === null)
		return true;
	const children = token.children;
	if (token.type === ParseTreeTokenType.STEP) {
		if (children.length === 0)
			return true;
		return false;
	}
	else if (token.type === ParseTreeTokenType.ARG_LIST)
		return false;
	return true;
}

function isGoodPreviousDown(token, next) {
	const children = token.children;
	if (children.length === 0)
		return true; // can't go to any children so stop going to last child.
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.IF) {
		if (lastChild.type === ParseTreeTokenType.ELSE &&
		lastChild.children.length === 0)
			return false;
	}
	if (token.type === ParseTreeTokenType.STEP) {
		if (next.type === ParseTreeTokenType.IDENTIFIER) {
			return lastChild.type !== ParseTreeTokenType.UNARY_OPERATOR;
		}
	}
	if (lastChild.type === ParseTreeTokenType.DO &&
	lastChild.children.length === 0)
		return false;
	return true;
}

function getGoodPrevious(token, next) {
	while (!isGoodPreviousUp(token, next)) {
		token = token.parentNode;
	}
	while (!isGoodPreviousDown(token, next))
		token = token.children[token.children.length - 1];
	return token;
}

export function addCodeBlock(prev, next) {
	prev = getGoodPrevious(prev, next);
	const codeBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.CODE_BLOCK);
	if (prevTypesToAppendCodeBlock.has(prev.type))
		prev.appendChild(codeBlock);
	else {
		next.appendChild(codeBlock);
		prev.appendChild(next);
	}
	return codeBlock;
};