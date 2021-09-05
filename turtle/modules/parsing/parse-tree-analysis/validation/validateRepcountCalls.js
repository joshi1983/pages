import { isInRepeat } from '../isInRepeat.js';

export function validateRepcountCalls(cachedParseTree, parseLogger) {
	const repcountCalls = cachedParseTree.getCommandCallsByName('repcount');
	repcountCalls.forEach(function(repcountToken) {
		if (!isInRepeat(repcountToken))
			parseLogger.error('repcount must not be called outside of a repeat', repcountToken);
	});
}