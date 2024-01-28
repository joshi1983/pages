import { DataTypes } from '../../data-types/DataTypes.js';
import { getRefTypes } from './getRefTypes.js';
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
	if (token.type === ParseTreeTokenType.VARIABLE_READ || refTypes !== undefined) {
		const variable = variables.getVariableByName(token.val.toLowerCase());
		if (variable !== undefined) {
			const varScopes = variable.getScopesAt(token, containingProc);
			for (let i = 0; i < varScopes.length; i++) {
				const varScope = varScopes[i];
				varScope.requiredTypes.intersectWith(requiredTypes);
				if (refTypes !== undefined && refTypes !== requiredTypes)
					varScope.requiredTypes.intersectWith(refTypes);
			}
		}
	}
};