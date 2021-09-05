import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.TREE_ROOT
]);

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.ELSE && lastChild !== undefined)
		return false;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	
	return prev;
}

function shouldCreateElseIf(prev, next) {
	if (prev.type === ParseTreeTokenType.ELSE) {
		return true;
	}
	return false;
}

export function processIf(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateElseIf(prev)) {
		const elseToken = prev;
		const prevParent = prev.parentNode;
		const ei = new ParseTreeToken(null, elseToken.lineIndex, elseToken.colIndex, ParseTreeTokenType.ELSE_IF);
		prevParent.replaceChild(elseToken, ei);
		ei.appendChild(elseToken);
		ei.appendChild(next);
		return ei;
	}
	else {
		prev.appendChild(next);
		return next;
	}
};