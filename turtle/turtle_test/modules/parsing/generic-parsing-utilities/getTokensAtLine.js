import { ArrayUtils } from '../../ArrayUtils.js';

/*
getTokensAtLine assumes the parse tree structure is related to the lineIndex and colIndex 
values in the tree's nodes.
For better efficiency, getTokensAtLine does not visit every node in the tree but rather visits the specified token, 
all of token's descendents, and all sibblings that that may be at lineIndex or may have descendents at lineIndex.
*/
export function getTokensAtLine(token, lineIndex) {
	if (token === null)
		throw new Error(`token must be a ParseTreeToken object instead of null`);
	if (lineIndex === undefined) {
		lineIndex = token.lineIndex;
		while (token.parentNode !== null && token.parentNode.parentNode !== null) {
			token = token.parentNode;
		}
		const tokens = getTokensAtLine(token, lineIndex);
		if (token.parentNode !== null) {
			for (let prev = token.getPreviousSibling(); prev !== null; prev = prev.getPreviousSibling()) {
				const tokensToAdd = getTokensAtLine(prev, lineIndex);
				if (tokensToAdd.length === 0)
					break;
				ArrayUtils.pushAll(tokens, tokensToAdd);
			}
			for (let next = token.getNextSibling(); next !== null; next = next.getNextSibling()) {
				const tokensToAdd = getTokensAtLine(next, lineIndex);
				if (tokensToAdd.length === 0)
					break;
				ArrayUtils.pushAll(tokens, tokensToAdd);
			}
		}
		return tokens;
	}
	const result = [];
	if (token.lineIndex === lineIndex)
		result.push(token);
	const children = token.children;
	for (let i = 0; i < children.length; i++) {
		const newTokens = getTokensAtLine(children[i], lineIndex);
		ArrayUtils.pushAll(result, newTokens);
	}
	return result;
};