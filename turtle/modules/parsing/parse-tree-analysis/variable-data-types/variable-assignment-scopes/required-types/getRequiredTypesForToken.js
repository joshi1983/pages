import { Command } from
'../../../../Command.js';
import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { getRequiredTypesForIf } from './getRequiredTypesForIf.js';
import { getRequiredTypesForInstructionList } from
'./getRequiredTypesForInstructionList.js';
import { intersectWithBinaryOperatorTypes } from
'./intersectWithBinaryOperatorTypes.js';
import { intersectWithCommandArgTypes } from
'./intersectWithCommandArgTypes.js';
import { intersectWithUnaryOperatorTypes } from
'./intersectWithUnaryOperatorTypes.js';
import { isInstructionList } from
'../../../isInstructionList.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();

const typeIntersecters = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, intersectWithBinaryOperatorTypes],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, intersectWithCommandArgTypes],
	[ParseTreeTokenType.UNARY_OPERATOR, intersectWithUnaryOperatorTypes]
]);

const functionsMap = new Map([
	['if', getRequiredTypesForIf]
]);
const commandsNotToIntersectInto = new Set(Array.from(functionsMap.keys()));

function shouldIntersectionsBeIgnoredForToken(token) {
	if (isInstructionList(token)) {
		const parent = token.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(parent.val);
			if (info !== undefined) {
				if (commandsNotToIntersectInto.has(info.primaryName)) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}

function processIntersections(token, variableName, tokenToTypes, result, leadingRequiredTypes) {
	if (shouldIntersectionsBeIgnoredForToken(token))
		return;
	const intersector = typeIntersecters.get(token.type);
	if (intersector !== undefined)
		intersector(token, variableName, tokenToTypes, result, leadingRequiredTypes);
	for (const child of token.children) {
		processIntersections(child, variableName, tokenToTypes, result, leadingRequiredTypes);
	}
}

export function getRequiredTypesForToken(cachedParseTree, variableName, token, tokenTypesMap, leadingRequiredTypes) {
	if (typeof leadingRequiredTypes !== 'object')
		throw new Error(`leadingRequiredTypes must be an object but got ${leadingRequiredTypes}`);
	if (isInstructionList(token))
		return getRequiredTypesForInstructionList(cachedParseTree, variableName, token, tokenTypesMap, leadingRequiredTypes);
	let unionedTypes, requiredTypes;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			const func = functionsMap.get(info.primaryName);
			if (func !== undefined)
				[unionedTypes, requiredTypes] = func(cachedParseTree, variableName, token, tokenTypesMap, leadingRequiredTypes);
		}
	}
	if (unionedTypes === undefined)
		unionedTypes = new DataTypes('');
	if (requiredTypes === undefined)
		requiredTypes = new DataTypes('*');
	processIntersections(token, variableName, tokenTypesMap, requiredTypes, leadingRequiredTypes);
	return [unionedTypes, requiredTypes];
};