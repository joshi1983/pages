import { DataTypes } from '../../data-types/DataTypes.js';
import { getRefTypes } from './getRefTypes.js';
import { getRequiredTypesForForSettingsToken } from
'./variable-assignment-scopes/getRequiredTypesForForSettingsToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function processRequiredTypes(token, requiredTypes, variables, containingProc) {
	const refTypes = getRefTypes(token);
	if (requiredTypes === undefined) {
		if (refTypes === undefined)
			return; // Can not do anything with unknown required types.
		else {
			requiredTypes = refTypes;
		}
	}
	if (!(requiredTypes instanceof DataTypes))
		requiredTypes = new DataTypes(requiredTypes);

	const forTypesString = getRequiredTypesForForSettingsToken(token);
	if (forTypesString !== undefined) {
		requiredTypes.intersectWith(new DataTypes(forTypesString));
	}

	if (token.type === ParseTreeTokenType.VARIABLE_READ || refTypes !== undefined) {
		const variable = variables.getVariableByName(token.val.toLowerCase());
		if (variable !== undefined) {
			const varScopes = variable.getScopesAt(token, containingProc);
			if (varScopes.length === 1) {
				const varScope = varScopes[0];
				if (varScope.conditionalRanges.length === 0) {
					varScope.requiredTypes.intersectWith(requiredTypes);
					if (refTypes !== undefined && refTypes !== requiredTypes)
						varScope.requiredTypes.intersectWith(refTypes);
				}
			}
		}
	}
};