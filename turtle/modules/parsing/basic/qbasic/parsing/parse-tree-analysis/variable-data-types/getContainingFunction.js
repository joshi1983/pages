import { functionDefinitionTypes } from
'../../functionDefinitionTypes.js';
import { getClosestOfTypes } from
'../../../../../generic-parsing-utilities/getClosestOfTypes.js';

export function getContainingFunction(token) {
	return getClosestOfTypes(token, functionDefinitionTypes);
};