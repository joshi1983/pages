import { Command } from '../../../Command.js';
import { DataTypes } from '../../../data-types/DataTypes.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();
const isinstanceNames = Command.getLowerCaseCommandNameSet(Command.getCommandInfo('isinstance'));

function intersectTypes(varName, map, types) {
	try {
		types = new DataTypes(types);
	}
	catch (e) {
		// if there is a problem turning types to a DataTypes instance, we'll assume it is not valid.
		return;
	}
	if (map.has(varName)) {
		map.get(varName).intersectWith(new DataTypes(types));
	}
	else
		map.set(varName, new DataTypes(types));
}

function handleAnd(andToken, cachedParseTree, tokenToDataTypes, tokenValuesMap, result) {
	andToken.children.forEach(function(child) {
		processChild(child, cachedParseTree, tokenToDataTypes, tokenValuesMap, result);
	});
}

function handleIsinstance(isinstanceToken, cachedParseTree, tokenToDataTypes, tokenValuesMap, result) {
	if (isinstanceToken.children.length === 2 && tokenValuesMap.has(isinstanceToken.children[1])) {
		const typesString = tokenValuesMap.get(isinstanceToken.children[1]);
		if (typeof typesString === 'string') {
			if (isinstanceToken.children[0].type === ParseTreeTokenType.VARIABLE_READ) {
				intersectTypes(isinstanceToken.children[0].val.toLowerCase(), result, typesString);
			}
		}
	}
}

function handleSingleTypeCheck(token, types, result) {
	if (token.children.length === 1) {
		if (token.children[0].type === ParseTreeTokenType.VARIABLE_READ) {
			intersectTypes(token.children[0].val.toLowerCase(), result, types);
		}
	}
}

function handleList(numberToken, cachedParseTree, tokenToDataTypes, tokenValuesMap, result) {
	handleSingleTypeCheck(numberToken, 'list', result);
}

function handleNumber(numberToken, cachedParseTree, tokenToDataTypes, tokenValuesMap, result) {
	handleSingleTypeCheck(numberToken, 'num', result);
}

function handleString(numberToken, cachedParseTree, tokenToDataTypes, tokenValuesMap, result) {
	handleSingleTypeCheck(numberToken, 'string', result);
}

const mapBase = new Map([
	['and', handleAnd],
	['isinstance', handleIsinstance],
	['list?', handleList],
	['number?', handleNumber],
	['string?', handleString],
]);
const map = new Map();
for (const [key, value] of mapBase) {
	const names = Command.getLowerCaseCommandNameSet(Command.getCommandInfo(key));
	for (const name of names)
		map.set(name, value);
}

function processChild(child, cachedParseTree, tokenToDataTypes, tokenValuesMap, result) {
	const callback = map.get(child.val.toLowerCase());
	if (callback !== undefined) {
		callback(child, cachedParseTree, tokenToDataTypes, tokenValuesMap, result);
	}
}

/*
The caller must make sure assertToken is a call to the assert command.

getRequiredTypesFromAssertion helps calculate required data types for variables used in a call to the assert command.
*/
export function getRequiredTypesFromAssertion(assertToken, cachedParseTree, tokenToDataTypes, tokenValuesMap) {
	const result = new Map();
	if (assertToken.children.length === 1 &&
	assertToken.children[0].type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const child = assertToken.children[0];
		processChild(child, cachedParseTree, tokenToDataTypes, tokenValuesMap, result);
	}
	return result;
};