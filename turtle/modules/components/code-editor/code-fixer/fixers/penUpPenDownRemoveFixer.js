import { getRecommendedRemovals } from '../../../../parsing/parse-tree-analysis/validation/pen-up/getRecommendedRemovals.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

export function penUpPenDownRemoveFixer(cachedParseTree, fixLogger) {
	const tokens = getRecommendedRemovals(cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP)).tokens;
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		token.remove();
		cachedParseTree.tokenRemoved(token);
		fixLogger.log(`Removed call to ${token.val} because it had no effect.`, token);
	}
};