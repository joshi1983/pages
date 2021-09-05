import { ArrayUtils } from '../../ArrayUtils.js';
import { getAllDescendentsAsArray } from './getAllDescendentsAsArray.js';
import { getSortedLastTokenFromArray } from './getSortedLastTokenFromArray.js';
import { getTokensAtLine } from './getTokensAtLine.js';
import { isAfterOrSame } from './isAfterOrSame.js';
import { isStrictlyAfter } from './isStrictlyAfter.js';

export function getSortedPreviousTokenOf(token, tieBreakCompare) {
	if (token === null)
		throw new Error(`Unable to get previous of null`);
	if (token.parentNode === null)
		return null;
	if (typeof tieBreakCompare !== 'function')
		throw new Error(`tieBreakCompare expected to be a function but got ${tieBreakCompare}`);
	let candidateTokens = getAllDescendentsAsArray(token);
	ArrayUtils.pushAll(candidateTokens, getTokensAtLine(token, token.lineIndex));
	let prev;
	for (const tok of candidateTokens) {
		if (isStrictlyAfter(token, tok)) {
			if (prev !== undefined && prev.lineIndex === tok.lineIndex &&
			prev.colIndex === tok.colIndex && tieBreakCompare(prev, tok) > 0)
				continue;
			if (prev === undefined || isAfterOrSame(tok, prev))
				prev = tok;
		}
	}
	if (prev !== undefined)
		return prev;
	candidateTokens = [];
	let tok = token;
	while (tok !== null && tok.previousSibling === null) {
		const parent = tok.parentNode;
		if (parent !== null && isStrictlyAfter(token, parent))
			candidateTokens.push(parent);
		tok = parent;
	}
	if (candidateTokens.length === 0) {
		if (tok !== null) {
			if (tok.previousSibling !== null) {
				prev = tok.previousSibling;
				let candidateTokens = getAllDescendentsAsArray(prev);
				if (prev.lineIndex !== token.lineIndex)
					ArrayUtils.pushAll(candidateTokens, getTokensAtLine(prev, prev.lineIndex));
			}
			if (tok.children.length !== 0) {
				const descendents = getAllDescendentsAsArray(tok);
				for (const d of descendents) {
					if (isStrictlyAfter(token, d))
						candidateTokens.push(d);
				}
			}
		}
	}
	if (candidateTokens.length !== 0)
		return getSortedLastTokenFromArray(candidateTokens, tieBreakCompare);
	if (prev !== undefined)
		return prev;
	return null;
};