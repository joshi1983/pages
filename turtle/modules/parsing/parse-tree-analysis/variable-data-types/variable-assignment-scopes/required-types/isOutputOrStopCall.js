import { Command } from
'../../../../Command.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';
await Command.asyncInit();

const stopOutputNames = new Set();
['output', 'stop'].forEach(function(name) {
	SetUtils.addAll(stopOutputNames, Command.getLowerCaseCommandNameSet(name));
});

export function isOutputOrStopCall(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	return stopOutputNames.has(token.val.toLowerCase());
};