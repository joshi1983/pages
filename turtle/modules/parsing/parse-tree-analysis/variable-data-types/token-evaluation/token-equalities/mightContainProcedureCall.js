import { Command } from
'../../../../Command.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

// Looks for something like (invoke "p 1 2) where "p is the name of a procedure
function mightBeInvokeProcedure(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'invoke')
		return false;

	const cprocNameToken = token.children[0];
	if (cprocNameToken === undefined ||
	!cprocNameToken.isStringLiteral())
		return true;
	
	return Command.getCommandInfo(cprocNameToken.val) === undefined;
}

export function mightContainProcedureCall(token) {
	return getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(t => Command.getCommandInfo(t.val) === undefined ||
		mightBeInvokeProcedure(t));
};