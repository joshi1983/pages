import { Command } from
'../../../../../parsing/Command.js';
import { flatten } from
'../../../../../parsing/generic-parsing-utilities/flatten.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isMatchingACallOrProcedure(name) {
	return function(token) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return true;

		return name === info.primaryName;
	};
}

function isOfInterest(token) {
	const prev = token.previousSibling;
	if (prev === null ||
	prev.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.isConsecutiveRepeatRedundant !== true)
		return false;
	const prevInfo = Command.getCommandInfo(prev.val);
	if (prevInfo === undefined || prevInfo.primaryName !== info.primaryName)
		return false;

	if (info.readCommand !== undefined) {
		/*
		Check for rare cases such as this:
		setPenSize(4)
		setPenSize(penSize * 2)

		Calling the associated read command in token would makes removal of prev risky.
		Removing prev will likely change the effect of the code.
		*/
		if (getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
			some(isMatchingACallOrProcedure(info.readCommand)))
			return false;

		// If the previous token's parameters include a call to a procedure,
		// it might cause side-effects that we don't want to lose by removing prev and all of its descendents.
		if (getDescendentsOfType(prev, ParseTreeTokenType.PARAMETERIZED_GROUP).
			some(t => Command.getCommandInfo(t.val) === undefined))
			return false;
	}

	return true;
}

export function removeRedundantConsecutiveCommandCalls(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	let removedSomething = false;
	calls.forEach(function(call) {
		const prev = call.previousSibling;
		if (prev === null)
			return; // This might happen if a previous iteration of forEach removed previousSibling.
		prev.remove();
		prev.parentNode = null;
		const prevTokens = flatten(prev);
		cachedParseTree.tokensRemoved(prevTokens);
		fixLogger.log(`Removed redundant consecutive call to ${call.val}`, call);
		removedSomething = true;
	});
	return removedSomething;
};