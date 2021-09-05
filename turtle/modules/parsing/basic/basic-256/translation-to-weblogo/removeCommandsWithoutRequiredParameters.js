import { Command } from
'../../../Command.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.argCount !== undefined && info.argCount > 0)
			return true;
		else if (info.args !== undefined && info.args.length !== 0)
			return true;
	}
	return false;
}

export function removeCommandsWithoutRequiredParameters(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	calls.forEach(function(callToken) {
		callToken.remove();
		fixLogger.log(`Removed call to ${callToken.val} because it did not have the required parameters`, callToken);
	});
	cachedParseTree.tokensRemoved(calls);
	return calls.length !== 0;
};