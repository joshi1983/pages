import { Command } from '../../Command.js';
import { fetchJson } from '../../../fetchJson.js';
import { getParameterizedGroupNameSuggestion } from '../getParameterizedGroupNameSuggestion.js';
import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { UnsupportedCommand } from '../../UnsupportedCommand.js';

export function getTipsForProcOrCommandName(cachedParseTree, parseLogger) {
	const leafTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.LEAF).
	filter(function(token) {
		return token.val.length > 1 &&
			token.nextSibling !== null &&
			token.nextSibling.type === ParseTreeTokenType.LEAF &&
			UnsupportedCommand.getUnsupportedCommandInfo(token.val) === undefined;
	});
	const tokensNotToCheck = new Set();
	leafTokens.forEach(function(leafToken) {
		// Don't look for tips on tokens were already included in a previously good tip.
		if (tokensNotToCheck.has(leafToken))
			return;

		const suggestionInfo = getParameterizedGroupNameSuggestion(leafToken, cachedParseTree.getProceduresMap());
		if (suggestionInfo !== undefined) {
			if (suggestionInfo.isHinted) {
				parseLogger.tip(`You might want "<span class="command">${suggestionInfo.name}</span>" instead of "${suggestionInfo.nameWithSpaces}".  That is recognized.`, leafToken, true);
				// Don't break because a hinted name might not be what the user wants.
				// It is worth continuing to look for other hints or a longer name may exactly match a command or procedure.
			}
			else {
				parseLogger.tip(`Try "<span class="command">${suggestionInfo.name}</span>" instead of "${suggestionInfo.nameWithSpaces}". The turtle knows how to <span class="command">${suggestionInfo.name}</span>.  Spaces are not allowed in command and procedure names.`, leafToken, true);

				// This is very likely to be what the user wants.
				// Don't make another suggestion associated with one of the included sibling tokens.
				suggestionInfo.extraTokens.forEach(t => tokensNotToCheck.add(t));
			}
		}
	});
};