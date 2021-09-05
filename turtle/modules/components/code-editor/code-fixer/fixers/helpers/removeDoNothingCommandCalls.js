import { Command } from
'../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getTokenValueBasic } from
'../../../../../parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

function isDoNothingGeneralReadCommand(token, info) {
	if (token.children.length !== 1)
		return false;

	const child = token.children[0];
	if (child === undefined || child.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const childInfo = Command.getCommandInfo(child.val);
	if (childInfo === undefined || childInfo.primaryName !== info.readCommand)
		return false;

	return true;
}

function isDoNothingIf(token, info) {
	if (info.primaryName !== 'if')
		return false;

	const children = token.children;
	if (children.length === 0)
		return false;

	const conditionToken = children[0];
	const val = getTokenValueBasic(conditionToken);
	return val === false || val === 0;
}

function isDoNothingRepeat(token, info) {
	if (info.primaryName !== 'repeat')
		return false;

	const children = token.children;
	if (children.length === 0)
		return false;

	const repeatCountToken = children[0];
	const val = getTokenValueBasic(repeatCountToken);
	if (!isNumber(val))
		return false;

	return val <= 0;
}

function isDoNothingUntil(token, info) {
	if (info.primaryName !== 'until')
		return false;

	const children = token.children;
	if (children.length === 0)
		return false;

	const conditionToken = children[0];
	const val = getTokenValueBasic(conditionToken);
	if (val === undefined)
		return false;

	return val === true || val !== 0;
}

function isDoNothingWhile(token, info) {
	if (info.primaryName !== 'while')
		return false;

	const children = token.children;
	if (children.length === 0)
		return false;

	const conditionToken = children[0];
	const val = getTokenValueBasic(conditionToken);
	return val === false || val === 0;
}

const doNothingChecks = [
	isDoNothingIf,
	isDoNothingGeneralReadCommand,
	isDoNothingRepeat,
	isDoNothingUntil,
	isDoNothingWhile
];

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;

	for (const doNothingCheck of doNothingChecks) {
		if (doNothingCheck(token, info))
			return true;
	}
	return false;
}

export function removeDoNothingCommandCalls(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).filter(isOfInterest);
	const removedSet = new Set();
	calls.forEach(function(call) {
		const tokens = getAllDescendentsAsArray(call);
		tokens.push(call);
		call.remove();
		cachedParseTree.tokensRemoved(tokens.filter(t => !removedSet.has(t)));
		SetUtils.addAll(removedSet, tokens);
		fixLogger.log(`Removed a call to command ${call.val} because it had no effect.`, call);
	});
};