import { getNearestLoopAncestor } from '../getNearestLoopAncestor.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isOfInterest(token) {
	if (getNearestLoopAncestor(token) === undefined)
		return true;
	const next = token.nextSibling;
	if (next !== null && next.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		return true;
	return false;
}

const suffix = '.  Learn more about the command by clicking <span class="command">break</span>.';

export function validateBreakCommand(cachedParseTree, parseLogger) {
	const breakCalls = cachedParseTree.getCommandCallsByName('break').filter(isOfInterest);
	breakCalls.forEach(function(breakCallToken) {
		if (getNearestLoopAncestor(breakCallToken) === undefined)
			parseLogger.error('break can be used only within a loop' + suffix, breakCallToken, true);
		else {
			parseLogger.warn('This break is followed by code that will never execute' + suffix, breakCallToken, true);
		}
	});
};