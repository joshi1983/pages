import { ArrayUtils } from '../../ArrayUtils.js';
import { getAllDescendentsAsArray } from './getAllDescendentsAsArray.js';

function matchesLineIndex(lineIndex) {
	return function(token) {
		return token.lineIndex === lineIndex;
	};
}

function goUpTree(token, lineIndex) {
	while (token.parentNode !== null) {
		const lastChild = token.children[token.children.length - 1];
		if (token.lineIndex !== lineIndex && lastChild !== undefined &&
		lastChild.lineIndex !== lineIndex)
			break;
		token = token.parentNode;
	}
	return token;
}

/*
getTokensAtLine assumes the parse tree structure is related to the lineIndex and colIndex 
values in the tree's nodes.
For better efficiency, getTokensAtLine does not visit every node in the tree but rather visits the specified token, 
all of token's descendents, and all sibblings that 
may be at lineIndex or may have descendents at lineIndex.
*/
export function getTokensAtLine(token) {
	if (token === null)
		throw new Error(`token must be a ParseTreeToken object instead of null`);
	const lineIndex = token.lineIndex;
	token = goUpTree(token, lineIndex);
	const result = [];
	if (token.lineIndex === lineIndex)
		result.push(token);
	for (let tok of getAllDescendentsAsArray(token)) {
		if (tok.lineIndex === lineIndex)
			result.push(tok);
	}
	let next = token.getNextSibling();
	while (next !== null) {
		const nextDescendents = getAllDescendentsAsArray(next);
		nextDescendents.push(next);
		const filtered = nextDescendents.filter(matchesLineIndex(lineIndex));
		if (filtered.length === 0)
			break;
		ArrayUtils.pushAll(result, filtered);
		next = next.getNextSibling();
	}
	let prev = token.getPreviousSibling();
	while (prev !== null) {
		const prevDescendents = getAllDescendentsAsArray(prev);
		prevDescendents.push(prev);
		const filtered = prevDescendents.filter(matchesLineIndex(lineIndex));
		if (filtered.length === 0)
			break;
		ArrayUtils.pushAll(result, filtered);
		prev = prev.getPreviousSibling();
	}
	return result;
};