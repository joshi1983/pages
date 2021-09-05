import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { checkTokenInProhibitedProcedure } from './checkTokenInProhibitedProcedure.js';
import { isAlwaysTrueToken } from './isAlwaysTrueToken.js';

export function validateInfiniteWhileLoops(cachedParseTree, parseLogger) {
	const infiniteWhileLoops = cachedParseTree.getCommandCallsByName('while').filter(function(token) {
		if (!isAlwaysTrueToken(token.children[0], cachedParseTree))
			return false;
		return !canFindHaltingCommandForLoopToken(token);
	});
	infiniteWhileLoops.forEach(function(whileLoopToken) {
		parseLogger.warn('This while-loop will never halt.  It is an infinite loop.', whileLoopToken);
		checkTokenInProhibitedProcedure(whileLoopToken, parseLogger);
	});
};