import { Command } from '../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function filterOutBrackets(tokens) {
	return tokens.filter(t => !t.isBracket());
}

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (info.primaryName !== 'if' && info.primaryName !== 'ifelse')
		return false;
	const firstInstructionList = token.children[1];
	if (firstInstructionList === undefined)
		return false; // if-statement is in a problematic state.
			// since we're not specifically trying to fix a 
			// missing code-block, we're not interested in this.

	const firstEmpty = filterOutBrackets(firstInstructionList.children).length === 0;
	if (info.primaryName === 'if' || !firstEmpty)
		return firstEmpty;

	const secondInstructionList = token.children[2];
	return filterOutBrackets(secondInstructionList.children).length === 0;
}

export function removeEmptyIfStatements(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	calls.forEach(function(call) {
		const toRemove = getAllDescendentsAsArray(call);
		toRemove.push(call);
		cachedParseTree.tokensRemoved(toRemove);
		call.remove();
		fixLogger.log(`Removed call to ${call.val} because it did not have any instructions in its instruction list`, call);
	});
};