import { canFindHaltingCommandForLoopToken } from './canFindHaltingCommandForLoopToken.js';
import { checkTokenInProhibitedProcedure } from './checkTokenInProhibitedProcedure.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function validateInfiniteForLoops(cachedParseTree, parseLogger) {
	const forTokens = cachedParseTree.getCommandCallsByName('for').filter(function(token) {
		if (token.children.length !== 2)
			return false;
		if (token.children[0].type !== ParseTreeTokenType.LIST || token.children[0].children.length !== 6)
			return false;
		const forControlTokens = token.children[0].children;
		// 3 of the control settings need to be constant numbers for this loop check 
		// to be reasonably simple.
		for (let i = 2; i < 5; i++) {
			if (forControlTokens[i].type !== ParseTreeTokenType.NUMBER_LITERAL)
				return false;
		}
		// look for an output, stop, or break call because they may stop the for-loop early.
		return !canFindHaltingCommandForLoopToken(token);
	});
	forTokens.forEach(function(forToken) {
		const forControlTokens = forToken.children[0].children;
		const start = forControlTokens[2].val;
		const limit = forControlTokens[3].val;
		const step = forControlTokens[4].val;
		let isInfiniteLoop = true;
		if (limit !== start && step === 0)
			parseLogger.warn('A step of 0 will make this an infinite loop', forControlTokens[4]);
		else if (limit !== start && ((limit > start) !== (step > 0)))
			parseLogger.warn('This will be an infinite loop because the step is going away from the limit.  Consider changing the sign of your step.', forControlTokens[4]);
		else
			isInfiniteLoop = false;
		if (isInfiniteLoop)
			checkTokenInProhibitedProcedure(forToken, parseLogger);
	});
};