import { isInRepeat } from '../isInRepeat.js';

export function validateRepRatioCalls(cachedParseTree, parseLogger) {
	const repRatioCalls = cachedParseTree.getCommandCallsByName('repRatio');
	repRatioCalls.forEach(function(repRatioToken) {
		if (!isInRepeat(repRatioToken))
			parseLogger.error('repRatio must not be called outside of a repeat', repRatioToken);
	});
}