import { Command } from
'../../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/ParseTreeTokenType.js';

export const symmetricNames = new Set([
	'abs', 'cos', 'radcos'
]);

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined ||
	!symmetricNames.has(info.primaryName.toLowerCase()))
		return false;
	
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.UNARY_OPERATOR ||
	firstChild.val !== '-')
		return false;

	return true;
}

export function simplifySignSymmetricParameterizedGroups(cachedParseTree, fixLogger) {
	const symmetricCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP)
		.filter(isOfInterest);
	symmetricCalls.forEach(function(absToken) {
		const argToken = absToken.children[0];
		argToken.removeSingleToken();
		cachedParseTree.tokenRemoved(argToken);
		fixLogger.log(`Removed unneeded unary - operator.  ${absToken.val} behaves the same regardless of sign.`, absToken);
	});
	
	return symmetricCalls.length !== 0;
};