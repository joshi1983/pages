import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.LOOP
]);

function shouldConvertToDoWhile(token) {
	return token.type === ParseTreeTokenType.DO &&
		token.children.length === 0;
}

function shouldConvertToLoopWhile(token) {
	return token.type === ParseTreeTokenType.LOOP &&
		token.children.length === 0;
}

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if (token.type === ParseTreeTokenType.DO) {
		return token.children.length === 0;
	}
	if (token.type === ParseTreeTokenType.LOOP &&
	parent.type === ParseTreeTokenType.DO_WHILE) {
		return false;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processWhile(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldConvertToDoWhile(prev)) {
		const doWhile = new ParseTreeToken(null, prev.lineIndex, prev.colIndex,
			ParseTreeTokenType.DO_WHILE);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, doWhile);
		prev.remove();
		doWhile.appendChild(prev);
		prev = doWhile;
	}
	else if (shouldConvertToLoopWhile(prev)) {
		const loopWhile = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.LOOP_WHILE);
		const prevParent = prev.parentNode;
		prev.remove();
		loopWhile.appendChild(prev);
		loopWhile.appendChild(next);
		prevParent.appendChild(loopWhile);
		return next;
	}
	prev.appendChild(next);
	if (prev.type === ParseTreeTokenType.EXIT)
		return prev.parentNode;
	return next;
};