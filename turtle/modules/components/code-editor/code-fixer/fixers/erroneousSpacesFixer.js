import { getParseTokensSorted } from '../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { moveArgsForParameterizedGroup } from './helpers/moveArgsForParameterizedGroup.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';

/*
Fixes errors where beginner programmers leave a space between 
: or " and a variable name or words they want in the string.
*/
export function erroneousSpacesFixer(cachedParseTree, fixLogger) {
	// using slice() to avoid mutating the same Array managed by WriteOptimizedCachedParseTree.
	// getParseTokenSorted mutates the array.
	const allTokens = cachedParseTree.getAllTokens().slice();
	const tokensOfInterest = new Set(cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.STRING_LITERAL, ParseTreeTokenType.VARIABLE_READ
	]).filter(function (t) {
		if (t.val !== '')
			return false;

		return true;
	}));
	if (tokensOfInterest.size !== 0) {
		getParseTokensSorted(allTokens);
		// filter some more by looking at the next token.
		const tokens = allTokens.filter(function(t, index) {
			if (!tokensOfInterest.has(t) || allTokens.length - 1 === index)
				return false;
			const nextToken = allTokens[index + 1];
			if (nextToken.type !== ParseTreeTokenType.LEAF || nextToken.isBracket())
				return false;

			// if removing the spaces will lead to an invalid variable name error, don't do the change.
			if (t.type === ParseTreeTokenType.VARIABLE_READ && validateIdentifier(nextToken.val) !== undefined)
				return false;
			return true;
		});
		tokens.forEach(function(t) {
			const index = allTokens.indexOf(t);
			const next = allTokens[index + 1];
			let ch;
			if (t.type === ParseTreeTokenType.STRING_LITERAL)
				ch = '"';
			else
				ch = ':';
			if (next.type !== t.type) {
				const oldType = next.type;
				next.type = t.type;
				cachedParseTree.tokenTypeChanged(next, oldType);
			}
			const parent = t.parentNode;
			const expectedArgCount = parent.children.length;
			next.remove();
			parent.replaceChild(t, next);
			moveArgsForParameterizedGroup(parent, expectedArgCount);
			cachedParseTree.tokenRemoved(t);
			fixLogger.log(`Removed all whitespaces between ${ch} and ${next.val} because any spaces between them introduce errors.`, t);
		});
	}
};