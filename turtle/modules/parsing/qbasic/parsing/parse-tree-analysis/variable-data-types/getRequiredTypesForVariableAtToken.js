import { getRequiredTypesIn } from
'./getRequiredTypesIn.js';
import { getTopLevelInstruction } from
'./getTopLevelInstruction.js';
import { mightAssignNewValue } from './mightAssignNewValue.js';

/*
Used for things like translating input to 
initializations for variables.
*/
export function getRequiredTypesForVariableAtToken(variableName, token) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string but found ${variableName}`);
	let tok = getTopLevelInstruction(token);
	let result;
	for (; tok !== null; tok = tok.getNextSibling()) {
		if (mightAssignNewValue(variableName, tok))
			break;
		const types = getRequiredTypesIn(variableName, tok);
		if (types !== undefined) {
			result = types;
		}
	}
	return result;
};