import { ArrayUtils } from '../../ArrayUtils.js';
import { getAllDescendentsAsArray } from './getAllDescendentsAsArray.js';
import { getSortedFirstTokenFromArray } from './getSortedFirstTokenFromArray.js';
import { getTokensAtLine } from './getTokensAtLine.js';
import { isStrictlyAfter } from './isStrictlyAfter.js';

/*
Returns the next token after the specified one compared by colIndex and lineIndex.

If you have all tokens in the tree sorted, you should
probably depend on array indexes within that instead of getSortedNextTokenAfter.
For example, sortedTokensArray[sortedTokensArray.indexOf(token) + 1].
getSortedNextTokenAfter assumes you don't have a sorted Array of tokens and it isn't 
worth the execution time sorting them all.
*/
export function getSortedNextTokenAfter(token) {
	let candidateTokens = getAllDescendentsAsArray(token);
	ArrayUtils.pushAll(candidateTokens, getTokensAtLine(token, token.lineIndex));
	let next;
	for (const tok of candidateTokens) {
		if (isStrictlyAfter(tok, token)) {
			if (next === undefined || isStrictlyAfter(next, tok))
				next = tok;
		}
	}
	if (next !== undefined)
		return next;
	candidateTokens = [];
	let tok = token;
	while (tok !== null && tok.nextSibling === null) {
		const parent = tok.parentNode;
		if (parent !== null && isStrictlyAfter(parent, token))
			candidateTokens.push(parent);
		tok = parent;
	}
	if (candidateTokens.length === 0) {
		if (tok !== null && tok.nextSibling !== null) {
			next = tok.nextSibling;
			let candidateTokens = getAllDescendentsAsArray(next);
			if (next.lineIndex !== token.lineIndex)
				ArrayUtils.pushAll(candidateTokens, getTokensAtLine(next, next.lineIndex));
		}
	}
	if (candidateTokens.length !== 0)
		return getSortedFirstTokenFromArray(candidateTokens);
	return null;
};