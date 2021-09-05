import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val !== 'import')
		return false;
	const nextSibling = token.nextSibling;
	if (nextSibling === null || nextSibling.type !== ParseTreeTokenType.LEAF)
		return false;
	return true;
}

export function removeImportsFixer(cachedParseTree, fixLogger) {
	const imports = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isOfInterest);
	const removedTokens = [];
	imports.forEach(function(token) {
		const packageToken = token.nextSibling;
		token.remove();
		packageToken.remove();
		removedTokens.push(token);
		removedTokens.push(packageToken);
		fixLogger.log(`Removed import ${packageToken.val} because WebLogo does not support imports`, token);
	});
	cachedParseTree.tokensRemoved(removedTokens);
};