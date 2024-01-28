import { Command } from '../../../../parsing/Command.js';
import { getParameterizedGroupNameSuggestion } from '../../../../parsing/parse-tree-analysis/getParameterizedGroupNameSuggestion.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
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
			fixLogger.log(`Renamed "${info.nameWithSpaces}" to "${info.name}"`, token);
			const oldValue = token.val;
			token.val = info.name;
			token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			cachedParseTree.tokenValueChanged(token, oldValue);
			cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
			for (let i = 0; i < info.extraTokens.length; i++) {
				const tok = info.extraTokens[i];
				tokensNotToCheck.add(tok);
				tok.remove();
				cachedParseTree.tokenRemoved(tok);
			}
			/*
			Simulate what createParameterizedGroups does by adding enough children to 
			match the required parameters of the command.
			*/
			const commandInfo = Command.getCommandInfo(token.val);
			const argCount = Command.getArgCount(commandInfo);
			if (argCount.isFlexible === false) {
				const remainingLen = token.parentNode.children.length - token.parentNode.children.indexOf(token);
				if (remainingLen > argCount.defaultCount) {
					for (let i = 0; i < argCount.defaultCount && token.nextSibling !== null; i++) {
						const nextSibling = token.nextSibling;
						nextSibling.remove();
						token.appendChild(nextSibling);
					}
				}
				else {
					token.type = ParseTreeTokenType.LEAF;
					cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.PARAMETERIZED_GROUP);
				}
			}
		}
	});
};