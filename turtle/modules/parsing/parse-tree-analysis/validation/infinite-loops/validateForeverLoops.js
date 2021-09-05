import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { checkTokenInProhibitedProcedure } from './checkTokenInProhibitedProcedure.js';

export function validateForeverLoops(cachedParseTree, parseLogger) {
	const foreverLoops = cachedParseTree.getCommandCallsByName('forever').filter(function(token) {
		return !canFindHaltingCommandForLoopToken(token);
	});
	foreverLoops.forEach(function(foreverLoopToken) {
		parseLogger.warn('This forever-loop will never halt.  It is an infinite loop.', foreverLoopToken);
		checkTokenInProhibitedProcedure(foreverLoopToken, parseLogger);
	});
};