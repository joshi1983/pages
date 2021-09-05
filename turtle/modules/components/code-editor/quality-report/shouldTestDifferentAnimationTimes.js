import { Command } from
'../../../parsing/Command.js';
import { getTokensByType } from
'../../../parsing/generic-parsing-utilities/getTokensByType.js';
import { getUncalledProcedures } from
'../../../parsing/parse-tree-analysis/validation/uncalled-procedures/getUncalledProcedures.js';
import { ParseTreeTokenType } from
'../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from
'../../../SetUtils.js';
await Command.asyncInit();

const commandNames = new Set();
for (const commandName of ['animation.time', 'animation.timeRatio',
'animation.clampedTimeRatio']) {
	SetUtils.addAll(commandNames, Command.getLowerCaseCommandNameSet(commandName));
}

export function shouldTestDifferentAnimationTimes(cachedParseTree) {
	let calls = getTokensByType(cachedParseTree, ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(t => commandNames.has(t.val.toLowerCase()));
	if (calls.length === 0)
		return false;
	const uncalledProcNames = getUncalledProcedures(cachedParseTree);
	calls = calls.filter(function(call) {
		const proc = cachedParseTree.getProcedureAtToken(call);
		if (proc !== undefined && uncalledProcNames.has(proc.name))
			return false;
		return true;
	});
	return calls.length !== 0;
};