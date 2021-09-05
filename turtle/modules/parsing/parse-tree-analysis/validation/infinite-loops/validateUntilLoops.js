import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { checkTokenInProhibitedProcedure } from './checkTokenInProhibitedProcedure.js';
import { isAlwaysFalseToken } from './isAlwaysFalseToken.js';

export function validateUntilLoops(cachedParseTree, parseLogger) {
	const untilLoops = cachedParseTree.getCommandCallsByName('until').filter(function(token) {
		if (!isAlwaysFalseToken(token.children[0], cachedParseTree))
			return false;
		return !canFindHaltingCommandForLoopToken(token);
	});
	untilLoops.forEach(function(untilLoopToken) {
		parseLogger.warn('This until-loop will never halt.  It is an infinite loop.', untilLoopToken);
		checkTokenInProhibitedProcedure(untilLoopToken, parseLogger);
	});
};