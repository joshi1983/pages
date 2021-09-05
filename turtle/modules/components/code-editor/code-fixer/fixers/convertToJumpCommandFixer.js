import { Command } from '../../../../parsing/Command.js';
import { getLastDescendentTokenOf } from '../../../../parsing/parse-tree-token/getLastDescendentTokenOf.js';
import { getTokenToJumpCommandRecommendations } from '../../../../parsing/parse-tree-analysis/validation/recommendJumpCommands.js';
import { getTokenValueBasic } from '../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';

const convertToListCommands = new Set();
const convertToListCommandPrimaryNames = ['setXY', 'setXYZ'];
convertToListCommandPrimaryNames.forEach(function(primaryName) {
	const info = Command.getCommandInfo(primaryName);
	const names = Command.getLowerCaseCommandNameSet(info);
	SetUtils.addAll(convertToListCommands, names);
});

export function convertToJumpCommandFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);
	function tokenToValue(token) {
		return getTokenValueBasic(token);
	}
	const recommendations = getTokenToJumpCommandRecommendations(tokens, tokenToValue);
	for (const [token, jumpCommand] of recommendations.entries()) {
		const oldValue = token.val;
		token.val = jumpCommand;
		cachedParseTree.tokenValueChanged(token, oldValue);
		if (convertToListCommands.has(oldValue.toLowerCase())) {
			// convert parameters to a single list parameter.
			const lastToken = getLastDescendentTokenOf(token);
			const paramList = new ParseTreeToken(null, null, token.lineIndex, token.colIndex+1, ParseTreeTokenType.LIST);
			const firstBracket = new ParseTreeToken('[', null, token.lineIndex, token.colIndex+1, ParseTreeTokenType.LEAF);
			const lastBracket = new ParseTreeToken(']', null, lastToken.lineIndex, lastToken.colIndex+1, ParseTreeTokenType.LEAF);
			paramList.appendChild(firstBracket);
			// move all the children from token to paramList.
			while (token.children.length !== 0) {
				const child = token.children[0];
				token.removeChild(child);
				paramList.appendChild(child);
			}
			paramList.appendChild(lastBracket);
			token.appendChild(paramList);
			cachedParseTree.tokensAdded([firstBracket, lastBracket, paramList]);
		}
		fixLogger.log(`Replaced ${oldValue} with ${jumpCommand} because the pen won't draw a line `+
		`there and 'jump' makes that more obvious.  `+
		`The jump command is also simpler since it behaves the same way regardless of the pen's state.`, token);
	}
};