import { isInProcedure } from '../isInProcedure.js';

export function validateLocalMakeNotForGlobalVariables(cachedParseTree, parseLogger) {
	const localMakeCalls = cachedParseTree.getCommandCallsByName('localmake').filter(t => !isInProcedure(t));
	localMakeCalls.forEach(function(token) {
		parseLogger.error('localmake is allowed only within a procedure', token);
	});
};