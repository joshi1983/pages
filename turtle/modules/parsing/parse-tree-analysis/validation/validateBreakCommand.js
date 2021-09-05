import { getNearestLoopAncestor } from '../getNearestLoopAncestor.js';

export function validateBreakCommand(cachedParseTree, parseLogger) {
	const breakCalls = cachedParseTree.getCommandCallsByName('break').filter(
		breakCall => getNearestLoopAncestor(breakCall) === undefined);
	breakCalls.forEach(function(breakCallToken) {
		parseLogger.error('break can be used only within a loop', breakCallToken);
	});
};