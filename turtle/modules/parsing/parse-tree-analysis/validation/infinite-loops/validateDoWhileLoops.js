import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { checkTokenInProhibitedProcedure } from './checkTokenInProhibitedProcedure.js';
import { isAlwaysTrueToken } from './isAlwaysTrueToken.js';

export function validateDoWhileLoops(cachedParseTree, parseLogger) {
	const doWhileLoops = cachedParseTree.getCommandCallsByName('do.while').filter(function(token) {
		if (!isAlwaysTrueToken(token.children[1], cachedParseTree))
			return false;
		return !canFindHaltingCommandForLoopToken(token);
	});
	doWhileLoops.forEach(function(loopToken) {
		parseLogger.warn('This do-while-loop will never halt.  It is an infinite loop.', loopToken);
		checkTokenInProhibitedProcedure(loopToken, parseLogger);
	});
};