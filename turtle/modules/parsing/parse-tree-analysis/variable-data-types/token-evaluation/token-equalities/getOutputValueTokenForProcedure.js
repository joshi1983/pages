import { Command } from
'../../../../Command.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isInstructionList } from
'../../../isInstructionList.js';
import { isLoop } from
'../../../isLoop.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

/*
Checks if token represents a token at the end of a procedure's instruction list.
For example, if token represented the output call in the following, true would be returned:

to p
	penUp
	penDown
	output 3
end
*/
function isAtEndOfProcedureInstructionList(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.LIST)
		return false;

	const index = parent.children.lastIndexOf(token);
	if (index !== parent.children.length - 1)
		return false;

	const grandParent = parent.parentNode;
	return grandParent.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD;
}

function mightCallBreak(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info.primaryName === 'break')
			return true; // definitely calls break.  token is a call to 'break'.
	}
	if (isLoop(token))
		return false;

	if (token.children.some(mightCallBreak))
		return true;

	return false;
}

function isAtEndOfLoopInstructionList(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.LIST)
		return false;
	
	const children = parent.children;
	if (children.indexOf(token) !== children.length - 2)
		return false;

	const grandParent = parent.parentNode;
	if (!isLoop(grandParent))
		return false;

	// are there any "break" calls might prevent token from running?
	for (let i = children.length - 2; i >= 0; i--) {
		const child = children[i];
		if (mightCallBreak(child))
			return false;
	}
	return true;
}

function definitelyRunWithProcedureCall(token) {
	while (token !== null &&
	!isInstructionList(token.parentNode))
		token = token.parentNode;

	if (isAtEndOfProcedureInstructionList(token))
		return true;

	if (isAtEndOfLoopInstructionList(token))
		return definitelyRunWithProcedureCall(token.parentNode);

	return false;
}

function isOfInterest(call) {
	const info = Command.getCommandInfo(call.val);
	if (info === undefined)
		return false;

	return info.primaryName === 'output' ||
	info.primaryName === 'stop';
}

export function getOutputValueTokenForProcedure(procedure) {
	const startToken = procedure.getStartToken();
	if (startToken === undefined)
		return;

	const calls = getDescendentsOfType(startToken, ParseTreeTokenType.PARAMETERIZED_GROUP).
	filter(isOfInterest);
	if (calls.length !== 1)
		return;

	const call = calls[0];
	const info = Command.getCommandInfo(call.val);
	if (info.primaryName !== 'output')
		return;
	
	// make sure the call is always run every time the procedure runs.
	if (definitelyRunWithProcedureCall(call))
		return call.children[0];
};