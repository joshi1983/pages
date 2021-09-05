import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function updateAssignTokenProcedureForVariableScopes(proceduresMap, variables) {
	// Filter scopes down to ones we might want to update to help performance.
	const scopes = variables.getAllScopesAsArray().filter(scope => 
		scope.assignTokenProcedure === undefined &&
		scope.assignToken.parentNode !== null &&
		scope.assignToken.parentNode.type !== ParseTreeTokenType.TREE_ROOT);
	scopes.forEach(function(scope) {
		// Get Procedure object so we can see its name.
		const proc = getProcedureFromAnyTokenInProcedure(scope.assignToken);
		// if a procedure is found...
		if (proc !== undefined) {
			// Match with the Procedure in the Map so JavaScript garbage collector can clean up our copy.
			// Linking to the same procedure instance might help us eventually maintain some cached data in the Procedure too.
			scope.assignTokenProcedure = proceduresMap.get(proc.name);
		}
	});
};