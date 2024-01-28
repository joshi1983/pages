import { alwaysEndsWithPolyEnd } from '../../../../parsing/parse-tree-analysis/validation/poly-command-usage/alwaysEndsWithPolyEnd.js';
import { Command } from '../../../../parsing/Command.js';
import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function isImmediatelyAfterProcedureCall(token) {
	const prev = token.previousSibling;
	if (prev === null || prev.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(prev.val);
	return info === undefined;
}

/*
polyFixer fixes some closely-related problems but not this specific one.
*/
export function polyEndAfterProcedureFixer(cachedParseTree, fixLogger) {
	const tokensToChange = CommandCalls.filterCommandCalls(
	cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP),
	'polyEnd').filter(isImmediatelyAfterProcedureCall);
	if (tokensToChange.length === 0)
		return;
	const procedures = cachedParseTree.getProceduresMap();
	tokensToChange.forEach(function(polyEnd) {
		const proc = procedures.get(polyEnd.previousSibling.val.toLowerCase());
		if (proc !== undefined && alwaysEndsWithPolyEnd(proc)) {
			polyEnd.remove();
			cachedParseTree.tokenRemoved(polyEnd);
			fixLogger.log(`Removed polyEnd call because it was immediately after calling procedure ${proc.name} which always calls polyEnd before completing.`, polyEnd);
		}
	});
};