import { Command } from
'../../../../Command.js';
import { containsOutputOrStop } from
'./containsOutputOrStop.js';
import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getRequiredTypesForToken } from
'./getRequiredTypesForToken.js';
import { isOutputOrStopCall } from
'./isOutputOrStopCall.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';
await Command.asyncInit();

const swapNames = Command.getLowerCaseCommandNameSet('swap');
const makeNames = new Set();
['localmake', 'make'].forEach(function(name) {
	SetUtils.addAll(makeNames, Command.getLowerCaseCommandNameSet(name));
});

const breakNames = Command.getLowerCaseCommandNameSet('break');

function isBreakCall(token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return;
	return breakNames.has(token.val.toLowerCase());
}

function assignsNewValueSingleToken(variableName, token) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	if (!makeNames.has(token.val.toLowerCase()))
		return false;
	const children = token.children;
	if (children.length === 0)
		return false;
	const first = children[0];
	if (!first.isStringLiteral())
		return false;
	else if (first.val.toLowerCase() !== variableName)
		return false;
	return true;
}

function assignsNewValue(variableName, token) {
	if (assignsNewValueSingleToken(variableName, token))
		return true;

	return getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(tok => assignsNewValueSingleToken(variableName, tok));
}

function isSwapCallAffectingVariable(token, variableName) {
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	if (!swapNames.has(token.val.toLowerCase()))
		return false;
	for (const child of token.children) {
		if (child.isStringLiteral() && child.val.toLowerCase() === variableName)
			return true;
	}
	return false;
}

function mightBreakFromAncestorInstructionList(token) {
	if (isBreakCall(token))
		return true;
	return getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(isBreakCall);
}

export function getRequiredTypesFromStart(cachedParseTree, variableName, startToken, tokenTypesMap, leadingRequiredTypes) {
	if (!(leadingRequiredTypes instanceof DataTypes))
		throw new Error(`leadingRequiredTypes must be a DataTypes but got ${leadingRequiredTypes}`);
	const unionedTypes = new DataTypes('');
	const result = new DataTypes(leadingRequiredTypes);
	while (startToken !== null) {
		const [unionedTypes_, requiredTypes] = getRequiredTypesForToken(cachedParseTree,
			variableName, startToken, tokenTypesMap, result);
		console.log(`=====================================`);
		console.log(`got result from getRequiredTypesForToken. startToken.val=${startToken.val}  unionedTypes_ = ${unionedTypes_} and requiredTypes = ${requiredTypes}`);
		unionedTypes.addTypes(unionedTypes_);
		result.intersectWith(requiredTypes);
		if (assignsNewValue(variableName, startToken))
			break;
		if (isOutputOrStopCall(startToken) || isSwapCallAffectingVariable(startToken, variableName))
			break;
		if (containsOutputOrStop(startToken)) {
			const intersected = new DataTypes(unionedTypes);
			console.log(`intersecting ${DataTypes.stringify(intersected)} with ${result}`);
			intersected.intersectWith(result);
			console.log(`After intersecting, intersected= ${intersected}`);
			unionedTypes.addTypes(intersected);
			console.log(`After the union, unionedTypes=${unionedTypes}`);
		}
		// if contains a call to break that may apply to any switch or loop command above startToken, break.
		if (mightBreakFromAncestorInstructionList(startToken))
			break;
		startToken = startToken.nextSibling;
	}
	console.log(`unionedTypes=${unionedTypes}, result=${result}`);
	return [unionedTypes, result];
};