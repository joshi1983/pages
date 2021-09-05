import { Command } from '../../../Command.js';
import { getDescendentsOfTypes } from
'../../../parse-tree-token/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';
await Command.asyncInit();
const safeCommands = new Set();
Command.getAllCommandsInfo().forEach(function(info) {
	if (info.primaryName === 'make' || info.primaryName === 'localmake')
		return;
	if (info.args.some(a => a.types === 'instructionlist'))
		return;
	if (info.args.some(a => a.refTypes !== undefined))
		return;
	SetUtils.addAll(safeCommands, Command.getLowerCaseCommandNameSet(info));
});

// variableName assumed to be in lower case
export function mightAffectVariableLength(token, variableName) {
	const tokens = getDescendentsOfTypes(token, [
		ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.LONG_STRING_LITERAL,
		ParseTreeTokenType.VARIABLE_READ
	]);
	if (!tokens.some(t => t.val.toLowerCase() === variableName))
		return false;
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return true;
	if (safeCommands.has(token.val.toLowerCase()))
		return false;
	return true;
};