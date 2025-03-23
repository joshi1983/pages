import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { getRequiredTypesFromStart } from
'./getRequiredTypesFromStart.js';

export function getRequiredTypesForInstructionList(cachedParseTree, variableName, listToken, tokenTypesMap, leadingRequiredTypes) {
	if (!(leadingRequiredTypes instanceof DataTypes))
		throw new Error(`leadingRequiredTypes must be a DataTypes but got ${leadingRequiredTypes}`);
	let startToken = listToken.children[0];
	if (startToken !== undefined) {
		return getRequiredTypesFromStart(cachedParseTree, variableName, startToken, tokenTypesMap, leadingRequiredTypes);
	}
	return [new DataTypes(''), new DataTypes('*')];
};