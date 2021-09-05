import { getRecommendedRemovals } from '../../../../parsing/parse-tree-analysis/validation/pen-up/getRecommendedRemovals.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

export function penUpPenDownRemoveFixer(cachedParseTree, fixLogger) {
	let tokens;
	do {
		tokens = getRecommendedRemovals(cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP)).tokens;
		for (const token of tokens) {
			token.remove();
			cachedParseTree.tokenRemoved(token);
			fixLogger.log(`Removed call to ${token.val} because it had no effect.`, token);
		}
	} while (tokens.length !== 0);
};