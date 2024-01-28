import { Command } from '../../../Command.js';
import { DataTypes } from '../../../data-types/DataTypes.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { typePredicateMap } from './typePredicateMap.js';
await DataTypes.asyncInit();

function handleAnd(andToken, variableName) {
	let result = undefined;
	for (let i = 0; i < andToken.children.length; i++) {
		const dataTypes = getSatisfyingDataTypes(andToken.children[i], variableName);
		if (dataTypes !== undefined) {
			if (result === undefined)
				result = dataTypes;
			else
				result.intersectWith(dataTypes);
		}
	}
	return result;
}

function handleOr(andToken, variableName) {
	let result = getSatisfyingDataTypes(andToken.children[0], variableName);
	if (result === undefined)
		return;
	for (let i = 1; i < andToken.children.length; i++) {
		const dataTypes = getSatisfyingDataTypes(andToken.children[i], variableName);
		if (dataTypes === undefined)
			return;
		else
			result.addTypes(dataTypes);
	}
	return result;
}

function getTypesFromParameterizedGroup(conditionToken, variableName) {
	const info = Command.getCommandInfo(conditionToken.val);
	if (info !== undefined) {
		if (typePredicateMap.has(info.primaryName)) {
			if (conditionToken.children.length === 1 &&
		conditionToken.children[0].type === ParseTreeTokenType.VARIABLE_READ &&
		conditionToken.children[0].val.toLowerCase() === variableName)
				return typePredicateMap.get(info.primaryName);
		}
		else if (info.primaryName === 'and')
			return handleAnd(conditionToken, variableName);
		else if (info.primaryName === 'or')
			return handleOr(conditionToken, variableName);
	}
}

export function getSatisfyingDataTypes(conditionToken, variableName) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string.  Not: ${variableName}`);
	if (conditionToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		return getTypesFromParameterizedGroup(conditionToken, variableName);
	if (conditionToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	conditionToken.children.length === 3)
		return getTypesFromParameterizedGroup(conditionToken.children[1], variableName);
};