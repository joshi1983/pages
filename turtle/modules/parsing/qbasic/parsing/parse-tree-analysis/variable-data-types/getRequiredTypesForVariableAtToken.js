import { functionDefinitionTypes } from '../../functionDefinitionTypes.js';
import { getClosestOfTypes } from
'../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { getRequiredTypesIn } from
'./getRequiredTypesIn.js';
import { getTopLevelInstruction } from
'./getTopLevelInstruction.js';
import { mightAssignNewValue } from './mightAssignNewValue.js';
import { mightBeEnding } from './mightBeEnding.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const typeTokenValsToDataTypes = new Map([
	['_bit', 'int'],
	['_byte', 'int'],
	['_float', 'num'],
	['_integer64', 'int'],
	['double', 'num'],
	['integer', 'int'],
	['long', 'int'],
	['single', 'num'],
	['string', 'string'],
]);

function isSpecificEnoughToStop(types) {
	if (types.indexOf('|') === -1)
		return true;
	return false;
}

function getTypesRequiredFromSuffixAndDeclaration(variableName, token) {
	const lastChar = variableName[variableName.length - 1];
	if ('%&'.indexOf(lastChar) !== -1)
		return 'int';
	if ('#!'.indexOf(lastChar) !== -1)
		return 'num';
	if (lastChar === '$')
		return 'string';

	const funcToken = getClosestOfTypes(token, functionDefinitionTypes);
	if (funcToken !== null) {
		const argList = funcToken.children[1];
		for (const child of argList.children) {
			if (child.type === ParseTreeTokenType.IDENTIFIER &&
			child.val.toLowerCase() === variableName &&
			child.children.length !== 0) {
				const firstChild = child.children[0];
				if (firstChild.type === ParseTreeTokenType.AS &&
				firstChild.children.length !== 0) {
					const typeToken = firstChild.children[0];
					if (typeToken.type === ParseTreeTokenType.IDENTIFIER) {
						const result = typeTokenValsToDataTypes.get(typeToken.val.toLowerCase());
						if (result !== undefined)
							return result;
					}
				}
			}
		}
	}
}

/*
Used for things like translating input to 
initializations for variables.

@param variableName should be a string representing the name
	of a variable in lower case.
*/
export function getRequiredTypesForVariableAtToken(variableName, token) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string but found ${variableName}`);
	let tok = getTopLevelInstruction(token);
	let result;
	for (; tok !== null; tok = tok.getNextSibling()) {
		const types = getRequiredTypesIn(variableName, tok);
		if (types !== undefined) {
			result = types;
			if (isSpecificEnoughToStop(result))
				break;
		}
		if (mightAssignNewValue(variableName, tok))
			break;
		if (mightBeEnding(tok))
			break;
	}
	if (result === undefined) {
		result = getTypesRequiredFromSuffixAndDeclaration(variableName, token);
	}
	return result;
};