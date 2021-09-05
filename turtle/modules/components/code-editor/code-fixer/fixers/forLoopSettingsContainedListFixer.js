import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(call) {
	if (call.children.length !== 2)
		return false;
	if (call.children[0].type !== ParseTreeTokenType.LIST)
		return false;
	const settings = call.children[0];
	if (settings.children.length < 4)
		return false;
	return settings.children.some(c => c.type === ParseTreeTokenType.LIST);
}

function convertBracket(token, expectedBracket, cachedParseTree) {
	if (token.val !== expectedBracket)
		return; // don't change anything.
	let newBracket;
	if (expectedBracket === '[')
		newBracket = '(';
	else
		newBracket = ')';
	token.val = newBracket;
	cachedParseTree.tokenValueChanged(token, expectedBracket);
}

/*
Fixes some differences between for-loop settings in FMSLogo and for-loop settings in WebLogo.
*/
export function forLoopSettingsContainedListFixer(cachedParseTree, logger) {
	const forTokens = CommandCalls.filterCommandCalls(
	cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP),
	'for').filter(isOfInterest);
	forTokens.forEach(function(forToken) {
		const settingsChildren = forToken.children[0].children;
		for (let i = 2; i < settingsChildren.length; i++) {
			const token = settingsChildren[i];
			if (token.type === ParseTreeTokenType.LIST) {
				// convert square brackets to curved.
				convertBracket(token.children[0], '[', cachedParseTree);
				convertBracket(token.children[token.children.length - 1], ']', cachedParseTree);
				token.type = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
				cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LIST);
				logger.log(`Converted list to curved bracket expression because list literals are not allowed in the settings for a for-loop in WebLogo`, forToken);
			}
		}
	});
};