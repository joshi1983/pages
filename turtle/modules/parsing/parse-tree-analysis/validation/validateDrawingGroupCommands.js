import { Command } from
'../../Command.js';
import { getTokensByType } from
'../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../SetUtils.js';
await Command.asyncInit();
const drawingCommandNames = new Set();
Command.getAllCommandsInfo().forEach(function(info) {
	if (info.commandGroup === 'drawing') {
		SetUtils.addAll(drawingCommandNames, Command.getLowerCaseCommandNameSet(info));
	}
});

export function validateDrawingGroupCommands(cachedParseTree, parseLogger) {
	const callsOfInterest = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(token => drawingCommandNames.has(token.val.toLowerCase()));
	for (const call of callsOfInterest) {
		const containingProc = cachedParseTree.getProcedureAtToken(call);
		if (containingProc === undefined ||
		containingProc.name !== 'animation.snapshotstyle') {
			parseLogger.error(`<span class="command">${call.val}</span> can be called within the animation.snapshotStyle procedure but nowhere else.`, call, true);
		}
	}
};