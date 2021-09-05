import { Command } from '../../../../parsing/Command.js';
import { getProcedureStartToken } from '../../../../parsing/parse-tree-analysis/getProcedureStartToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();

const stopNames = Command.getLowerCaseCommandNameSet(Command.getCommandInfo('stop'));
const commandsWithTrailingInstructionLists = new Set();
// Not including do.while because a condition is checked after the instruction list.
// There is a chance that the condition could call a procedure and change the behaviour 
// of the program by removing the trailing stop call.
['forever', 'if', 'ifelse', 'repeat', 'while'].forEach(function(name) {
	SetUtils.addAll(commandsWithTrailingInstructionLists, Command.getLowerCaseCommandNameSet(Command.getCommandInfo(name)));
});

function isLastInProcedure(stopCallToken) {
	const parent = stopCallToken.parentNode;
	if (stopCallToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		if (parent.type !== ParseTreeTokenType.LIST)
			return false;
		const next = stopCallToken.nextSibling;
		if (next !== null && next.val !== ']') {
			return false;
		}
		const grandParent = parent.parentNode;
		if (grandParent.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD)
			return true;
		if (grandParent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		if (!commandsWithTrailingInstructionLists.has(grandParent.val.toLowerCase()))
			return false;
		return isLastInProcedure(grandParent);
	}
	return false;
}

function isStopOfInterest(cachedParseTree) {
	return function(token) {
		if (!stopNames.has(token.val.toLowerCase()))
			return false;
		const proc = getProcedureStartToken(token);
		if (proc === undefined)
			return false;
		return isLastInProcedure(token);
	};
}

export function stopRemoveFixer(cachedParseTree, fixLogger) {
	const stops = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isStopOfInterest(cachedParseTree));
	stops.forEach(function(stop) {
		stop.remove();
		fixLogger.log('Removed call to stop because it didn\'t have any effect. ' +
		'Not calling stop at the end of a procedure is the same as calling it. ' +
		'We also want the code to be as short as possible so removing redundancies like this is a good thing.',
		stop);
	});
	cachedParseTree.tokensRemoved(stops);
};