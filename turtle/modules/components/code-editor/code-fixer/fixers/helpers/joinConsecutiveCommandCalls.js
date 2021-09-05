import { Command } from
'../../../../../parsing/Command.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

export const namesToFix = new Set([
	'backward', 'forward', 'jumpBackward', 'jumpForward', 'jumpLeft', 'jumpRight',
	'left', 'right'
]);

function callsProcedure(token) {
	return getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(t => Command.getCommandInfo(t.val) === undefined);
}

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	if (!namesToFix.has(info.primaryName))
		return false;
	if (callsProcedure(token))
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const nextInfo = Command.getCommandInfo(next.val);
	if (nextInfo === undefined || nextInfo.primaryName !== info.primaryName)
		return false;
	if (callsProcedure(next))
		return false;
	return true;
}

function joinConsecutiveCalls(cachedParseTree, token) {
	const next = token.nextSibling;
	const tokenChild = token.children[0];
	const nextChild = next.children[0];
	const plusOperator = new ParseTreeToken('+', null, next.lineIndex, next.colIndex, ParseTreeTokenType.BINARY_OPERATOR);
	token.replaceChild(tokenChild, plusOperator);
	nextChild.remove();
	plusOperator.appendChild(tokenChild);
	plusOperator.appendChild(nextChild);
	next.remove();
	cachedParseTree.tokenAdded(plusOperator);
	cachedParseTree.tokenRemoved(next);
}

export function joinConsecutiveCommandCalls(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	tokens.forEach(function(token) {
		if (token.parentNode === null)
			return; // a previous joinConsecutiveCalls likely removed token so there is nothing to do.

		while (isOfInterest(token))
			joinConsecutiveCalls(cachedParseTree, token);
			
		fixLogger.log(`Combined consecutive calls to command ${token.val} to have shorter and clearer code.`, token);
	});
	return tokens.length !== 0;
};