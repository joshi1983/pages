import { getRequiredTypesIn } from
'./getRequiredTypesIn.js';
import { getTopLevelInstruction } from
'./getTopLevelInstruction.js';
import { mightAssignNewValue } from './mightAssignNewValue.js';
import { mightBeEnding } from './mightBeEnding.js';

function isSpecificEnoughToStop(types) {
	if (types.indexOf('|') === -1)
		return true;
	return false;
}

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
	return result;
};