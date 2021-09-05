import { Command } from '../../../../parsing/Command.js';
import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getDescendentsOfType } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { isInstructionList } from '../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

await Command.asyncInit();
const polyEndNames = Command.getLowerCaseCommandNameSet(Command.getCommandInfo('polyEnd'));

function isProcedureCall(token) {
	const info = Command.getCommandInfo(token.val);
	return info === undefined;
}

function isOfInterest(token) {
	if (!polyEndNames.has(token.val.toLowerCase()))
		return false;
	if (token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (!isInstructionList(parent))
		return false;
	// trace previous commands.
	let tok = token.previousSibling;
	while (tok !== null) {
		if (tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		polyEndNames.has(tok.val.toLowerCase()))
			return true;
		if (CommandCalls.tokenMatchesPrimaryName(tok, 'polyStart'))
			return false;
		const descendents = getDescendentsOfType(tok, ParseTreeTokenType.PARAMETERIZED_GROUP);
		if (tok.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
			descendents.push(tok);
		if (descendents.some(isProcedureCall))
			return false;
		tok = tok.previousSibling;
	}
	if (parent.type === ParseTreeTokenType.TREE_ROOT)
		return true;
	return false;
}

export function removeUnstartedPolyEndFixer(cachedParseTree, fixLogger) {
	const polyEndCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	polyEndCalls.forEach(function(polyEndCall) {
		polyEndCall.remove();
		cachedParseTree.tokenRemoved(polyEndCall);
		fixLogger.log(`Removed call to ${polyEndCall.val} because it was not started by a call to polyStart.  Click <span class="command">polyEnd</span> to learn more about the command and see examples using it.`, polyEndCall, true);
	});
};