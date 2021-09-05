import { Command } from
'../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(parent.val);
	if (info === undefined)
		return false;
	const index = parent.children.indexOf(token);
	const paramInfo = Command.getParameterInfo(info, index);
	if (paramInfo.types === 'instructionlist')
		return true;

	return false;
}

export function replaceCurvedBracketsFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		token.type = ParseTreeTokenType.LIST;
		const children = token.children;
		const firstChild = children[0];
		const lastChild = children[children.length - 1];
		firstChild.val = '[';
		if (lastChild.val === ')')
			lastChild.val = ']';

		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
		fixLogger.log(`Replaced () brackets with square brackets [] because square brackets should surround all instruction lists in WebLogo`, token);
	});
	return tokens.length !== 0;
};