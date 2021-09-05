import { createTokenFromToken } from './createTokenFromToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodPrevious(prev) {
	const children = prev.children;
	if (children.length !== 0) {
		const last = children[children.length - 1];
		if (last.type === ParseTreeTokenType.ASYNC ||
		last.type === ParseTreeTokenType.DECORATOR)
			return last;
	}
	return prev;
}

function addPreviousChildren(prev, funcDef) {
	let tok = prev;
	const prevParent = prev.parentNode;
	let previousAdded = false;
	while (tok !== null && 
	(tok.type === ParseTreeTokenType.ASYNC ||
	tok.type === ParseTreeTokenType.DECORATOR)) {
		const newTok = tok.getPreviousSibling();
		tok.remove();
		funcDef.insertAsFirstChild(tok);
		tok = newTok;
		previousAdded = true;
	}
	if (previousAdded)
		return prevParent;
	else
		return prev;
}

export function processDef(prev, next) {
	prev = getGoodPrevious(prev);
	const functionDef = createTokenFromToken(null, next, ParseTreeTokenType.FUNCTION_DEFINITION);
	prev = addPreviousChildren(prev, functionDef);
	functionDef.appendChild(next);
	prev.appendChild(functionDef);
	return functionDef;
};