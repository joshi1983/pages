import { CommandCalls } from '../CommandCalls.js';

function isInRepeat(token) {
	if (token === null)
		return false;
	if (CommandCalls.tokenMatchesPrimaryName(token, 'repeat'))
		return true;
	return isInRepeat(token.parentNode);
}

export function validateRepcountCalls(cachedParseTree, parseLogger) {
	const repcountCalls = cachedParseTree.getCommandCallsByName('repcount');
	repcountCalls.forEach(function(repcountToken) {
		if (!isInRepeat(repcountToken))
			parseLogger.error('repcount must not be called outside of a repeat', repcountToken);
	});
}