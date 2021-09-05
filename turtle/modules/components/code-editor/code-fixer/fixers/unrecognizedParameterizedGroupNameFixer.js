import { Command } from '../../../../parsing/Command.js';
import { getParameterizedGroupNameSuggestion } from '../../../../parsing/parse-tree-analysis/getParameterizedGroupNameSuggestion.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { renameParameterizedGroupToken } from './helpers/renameParameterizedGroupToken.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';
await Command.asyncInit();

function isLikelyWebTurtleCode(cachedParseTree) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(token => token.val === '#');
	return tokens.length !== 0;
}

export function unrecognizedParameterizedGroupNameFixer(cachedParseTree, fixLogger) {
	let tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(function(token) {
		if (validateIdentifier(token.val) !== undefined)
			return false;
		return Procedure.isNameToken(token) === false;
	});
	if (tokens.length === 0)
		return;
	const proceduresMap = cachedParseTree.proceduresMap;
	const tokensNotToCheck = new Set();
	if (isLikelyWebTurtleCode(cachedParseTree)) {
		// Don't convert 'return' to 'output' when this is likely a WebTurtle program.
		tokens = tokens.filter(token => token.val.toLowerCase() !== 'return');
	}
	tokens.forEach(function(token) {
		if (tokensNotToCheck.has(token)) // if already removed from tree, skip it.
			return;

		const info = getParameterizedGroupNameSuggestion(token, proceduresMap);
		if (info !== undefined && info.nameWithSpaces !== info.name) {
			renameParameterizedGroupToken(cachedParseTree, token, info.nameWithSpaces, info.name, info, fixLogger, tokensNotToCheck);
		}
	});
};