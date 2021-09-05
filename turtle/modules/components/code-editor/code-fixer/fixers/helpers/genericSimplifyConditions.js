import { CachedParseTree } from
'../../../../../parsing/parse-tree-analysis/CachedParseTree.js';
import { Command } from
'../../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getTokensByType } from
'../../../../../parsing/generic-parsing-utilities/getTokensByType.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

const commandsOfInterest = new Set();
const conditionIndexMap = new Map([
	['do.while', 1],
	['if', 0],
	['ifelse', 0],
	['until', 0],
	['while', 0],
]);
for (const name of conditionIndexMap.keys()) {
	const info = Command.getCommandInfo(name);
	if (info === undefined)
		throw new Error(`Failed to get command info for name ${name}`);
	SetUtils.addAll(commandsOfInterest, Command.getLowerCaseCommandNameSet(info));
}

function tokenToConditionToken(token) {
	const commandName = token.val.toLowerCase();
	const info = Command.getCommandInfo(commandName);
	if (info === undefined)
		return;
	const conditionChildIndex = conditionIndexMap.get(info.primaryName);
	const conditionToken = token.children[conditionChildIndex];
	return conditionToken;
}

function isOfInterest(tokenValues) {
	return function(token) {
		const conditionToken = tokenToConditionToken(token);
		if (conditionToken === undefined || conditionToken.children.length === 0)
			return false;

		const conditionVal = tokenValues.get(conditionToken);
		return isNumber(conditionVal) ||
			typeof conditionVal === 'boolean';
	};
}

/*
cachedParseTree should be a WriteOptimizedCachedParseTree.
*/
export function genericSimplifyConditions(shouldCheckToken) {
	if (typeof shouldCheckToken !== 'function')
		throw new Error(`shouldCheckToken must be a function but found ${shouldCheckToken}`);

	return function(cachedParseTree, fixLogger) {
		const readCachedParseTree = new CachedParseTree(cachedParseTree.root,
			cachedParseTree.getProceduresMap(), new Map());
		const tokenValues = readCachedParseTree.getTokenValues();
		const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
			filter(shouldCheckToken).
			filter(isOfInterest(tokenValues));
		tokens.forEach(function(token) {
			const conditionToken = tokenToConditionToken(token);
			const oldType = conditionToken.type;
			const tokenVal = tokenValues.get(conditionToken);
			conditionToken.val = tokenVal;
			conditionToken.originalString = '' + tokenVal;
			if (isNumber(tokenVal))
				conditionToken.type = ParseTreeTokenType.NUMBER_LITERAL;
			else
				conditionToken.type = ParseTreeTokenType.BOOLEAN_LITERAL;

			const removedTokens = getAllDescendentsAsArray(conditionToken);
			while (conditionToken.children.length !== 0) {
				const children = conditionToken.children;
				const lastChild = children[children.length - 1];
				lastChild.remove();
			}
			cachedParseTree.tokenTypeChanged(conditionToken, oldType);
			cachedParseTree.tokensRemoved(removedTokens);
			fixLogger.log(`Simplified condition expression`, token);
		});
		return tokens.length !== 0;
	};
}