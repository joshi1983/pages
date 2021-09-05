import { ForLoops } from '../../../../parsing/parse-tree-analysis/ForLoops.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

export function forLoopVariableFixer(cachedParseTree, logger) {
	const forLoopTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(ForLoops.isAForLoopToken).
		filter(function(token) {
			// is the intended variable token a LEAF?
			const nameToken = ForLoops.getVariableNameToken(token);
			if (nameToken === undefined || nameToken.type !== ParseTreeTokenType.LEAF)
				return false;
			return true;
		});
	forLoopTokens.forEach(function(forToken) {
		const nameToken = ForLoops.getVariableNameToken(forToken);
		const previousType = nameToken.type;
		nameToken.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(nameToken, previousType);
		logger.log(`Added quote(") before variable ${nameToken.val} in a for-loop`, nameToken);
	});
};