import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	return token.val === '\\';
}

export function slashFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (tokens.length === 0)
		return;
	tokens.forEach(function(slashToken) {
		slashToken.remove();
	});
	cachedParseTree.tokensRemoved(tokens);
	fixLogger.log(`Removed ${tokens.length} \\ character${tokens.length !== 1 ? 's' : ''} because they are meaningless on their own in WebLogo.`, tokens[0]);
};