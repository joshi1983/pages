import { Command } from '../../../../parsing/Command.js';
import { getParameterizedGroupNameSuggestion } from '../../../../parsing/parse-tree-analysis/getParameterizedGroupNameSuggestion.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';
await Command.asyncInit();

export function unrecognizedParameterizedGroupNameFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(function(token) {
		if (validateIdentifier(token.val) !== undefined)
			return false;
		return Procedure.isNameToken(token) === false;
	});
	if (tokens.length === 0)
		return;
	const proceduresMap = cachedParseTree.proceduresMap;
	const tokensNotToCheck = new Set();
	tokens.forEach(function(token) {
		if (tokensNotToCheck.has(token)) // if already removed from tree, skip it.
			return;

		const info = getParameterizedGroupNameSuggestion(token, proceduresMap);
		if (info !== undefined && info.nameWithSpaces !== info.name) {
			fixLogger.log(`Renamed "${info.nameWithSpaces}" to "${info.name}"`, token);
			token.val = info.name;
			for (let i = 0; i < info.extraTokens.length; i++) {
				const tok = info.extraTokens[i];
				tokensNotToCheck.add(tok);
				tok.parentNode.removeChild(tok);
				cachedParseTree.tokenRemoved(tok);
			}
		}
	});
};