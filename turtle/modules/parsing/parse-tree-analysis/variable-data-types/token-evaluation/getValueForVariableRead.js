import { getProcedureFromAnyTokenInProcedure } from '../getProcedureFromAnyTokenInProcedure.js';

export function getValueForVariableRead(token, variables) {
	const variable = variables.getVariableByName(token.val.toLowerCase());
	if (variable !== undefined) {
		const procedure = getProcedureFromAnyTokenInProcedure(token);
		const scopes = variable.getScopesAt(token, procedure);
		if (scopes.length === 1) {
			const scope = scopes[0];
			if (scope.isSingleValueApplicableAt(token, procedure))
				return scope.singleValue;
		}
	}
};