import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isElseExpectingCodeBlock(elseToken) {
	return true;
}

function isForExpectingCodeBlock(forToken) {
	const children = forToken.children;
	if (children.length < 3)
		return false;

	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.COLON)
		return false;

	const parent = forToken.parentNode;
	if (parent.type === ParseTreeTokenType.END_FOR)
		return false;

	return true;
}

function isProcOrFunctionExpectingCodeBlock(prev, next) {
	const children = prev.children;
	if (children.length === 0)
		return false;

	const parent = prev.parentNode;
	if (parent.type === ParseTreeTokenType.DEFERRED)
		return false;

	if (parent.type !== ParseTreeTokenType.BODY) {
		if (!children.some(c => c.type === ParseTreeTokenType.FORMAL_ARG_LIST))
			return false;
	}
	return true;
}

function isFunctionExpectingCodeBlock(fToken, next) {
	if (!isProcOrFunctionExpectingCodeBlock(fToken, next))
		return false;

	const children = fToken.children;
	if (next.type === ParseTreeTokenType.END)
		return true;

	if (children.length < 4)
		return false;
	return true;
}

function isProcedureExpectingCodeBlock(pToken, next) {
	if (!isProcOrFunctionExpectingCodeBlock(pToken, next))
		return false;
	return true;
}

function isIfExpectingCodeBlock(token) {
	const children = token.children;
	if (children.length < 2)
		return false;

	if (!children.some(t => t.type === ParseTreeTokenType.THEN))
		return false;

	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.CODE_BLOCK)
		return false;

	if (lastChild.type === ParseTreeTokenType.ELSE ||
	lastChild.type === ParseTreeTokenType.ELSIF) {
		const grandchildren = lastChild.children;
		const lastGrandchild = grandchildren[grandchildren.length - 1];
		if (lastGrandchild === undefined) {
			return lastChild.type === ParseTreeTokenType.ELSE;
		}
		if (lastGrandchild.type === ParseTreeTokenType.CODE_BLOCK)
			return false;
	}
	return true;
}

function isLoopExpectingCodeBlock(loopToken) {
	const children = loopToken.children;
	if (children.length !== 0)
		return false;

	const parent = loopToken.parentNode;
	if (parent.type === ParseTreeTokenType.END_LOOP)
		return false;

	return true;
}

function isProcessExpectingCodeBlock(processToken) {
	const children = processToken.children;
	if (children.length === 0)
		return false;

	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.CODE_BLOCK ||
	lastChild.type === ParseTreeTokenType.END_PROCESS)
		return false;
	
	return true;
}

const typesExpectingCodeBlockChildren = new Map([
	[ParseTreeTokenType.ELSE, isElseExpectingCodeBlock],
	[ParseTreeTokenType.ELSIF, isIfExpectingCodeBlock],
	[ParseTreeTokenType.FOR, isForExpectingCodeBlock],
	[ParseTreeTokenType.FUNCTION, isFunctionExpectingCodeBlock],
	[ParseTreeTokenType.IF, isIfExpectingCodeBlock],
	[ParseTreeTokenType.LOOP, isLoopExpectingCodeBlock],
	[ParseTreeTokenType.PROCEDURE, isProcedureExpectingCodeBlock],
	[ParseTreeTokenType.PROCESS, isProcessExpectingCodeBlock]
]);

function shouldAddCodeBlock(prev, next) {
	const prevChecker = typesExpectingCodeBlockChildren.get(prev.type);
	if (prevChecker === undefined || !prevChecker(prev, next))
		return false;
	if (prev.type !== ParseTreeTokenType.IF &&
	prev.children.some(c => c.type === ParseTreeTokenType.CODE_BLOCK))
		return false; // if prev already has a code block, it shouldn't anymore code blocks.

	return true;
}

function shouldAppendToLastChild(prev) {
	if (prev.type === ParseTreeTokenType.IF) {
		const children = prev.children;
		const lastChild = children[children.length - 1];
		return lastChild.type === ParseTreeTokenType.ELSE ||
		lastChild.type === ParseTreeTokenType.ELSIF;
	}
	return false;
}

export function addCodeBlockIfNeeded(prev, next) {
	if (shouldAddCodeBlock(prev, next)) {
		const codeBlock = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.CODE_BLOCK);
		const oldPrev = prev;
		if (shouldAppendToLastChild(prev))
			prev = prev.children[prev.children.length - 1];

		prev.appendChild(codeBlock);
		if (next.type === ParseTreeTokenType.END ||
		next.type === ParseTreeTokenType.ELSE)
			return oldPrev;
		return codeBlock;
	}
	return prev;
};