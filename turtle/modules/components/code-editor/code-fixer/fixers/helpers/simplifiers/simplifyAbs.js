import { Command } from
'../../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined ||
	info.primaryName !== 'abs')
		return false;
	
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.UNARY_OPERATOR ||
	firstChild.val !== '-')
		return false;

	return true;
}

export function simplifyAbs(cachedParseTree, fixLogger) {
	const abs = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP)
		.filter(isOfInterest);
	abs.forEach(function(absToken) {
		const argToken = absToken.children[0];
		argToken.removeSingleToken();
		cachedParseTree.tokenRemoved(argToken);
		fixLogger.log(`Converted createPList2 to createPList and removed empty list argument.  ` +
		`That simplifies the code without important changing functionality.`, absToken);
	});
	
	return abs.length !== 0;
};