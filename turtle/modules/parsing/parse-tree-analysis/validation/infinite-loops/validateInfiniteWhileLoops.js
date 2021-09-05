import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { checkTokenInProhibitedProcedure } from './checkTokenInProhibitedProcedure.js';
import { isAlwaysTrueToken } from './isAlwaysTrueToken.js';
import { isAllOrNothingWhileLoop } from './isAllOrNothingWhileLoop.js';

export function validateInfiniteWhileLoops(cachedParseTree, parseLogger) {
	const whileTokens = cachedParseTree.getCommandCallsByName('while').filter(token => !canFindHaltingCommandForLoopToken(token));
	const infiniteWhileLoops = whileTokens.filter(function(token) {
		if (!isAlwaysTrueToken(token.children[0], cachedParseTree))
			return false;
		return true;
	});
	infiniteWhileLoops.forEach(function(whileLoopToken) {
		parseLogger.warn('This while-loop will never halt.  It is an infinite loop.', whileLoopToken);
		checkTokenInProhibitedProcedure(whileLoopToken, parseLogger);
	});
	const infiniteWhileLoopsSet = new Set(infiniteWhileLoops);
	const whileTokensFiltered = new Set(whileTokens.filter(t => !infiniteWhileLoopsSet.has(t)));
	for (const whileToken of whileTokensFiltered) {
		if (isAllOrNothingWhileLoop(whileToken, cachedParseTree))
			parseLogger.warn(`This while loop will either loop forever or not at all.  The condition for this while loop doesn't change value in the loop.`, whileToken);
	}
};