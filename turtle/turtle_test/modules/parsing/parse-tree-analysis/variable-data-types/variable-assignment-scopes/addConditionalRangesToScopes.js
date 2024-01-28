import { addConditionalRangesToVariableAssignmentScope } from 
	'./addConditionalRangesToVariableAssignmentScope.js';

export function addConditionalRangesToScopes(cachedParseTree, scopes) {
	for (let i = 0; i < scopes.length; i++) {
		addConditionalRangesToVariableAssignmentScope(scopes[i], cachedParseTree);
	}
};