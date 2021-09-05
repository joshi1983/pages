import { compareTokenLocations } from '../../../parse-tree-token/compareTokenLocations.js';

export function compareVariableAssignmentScopes(scope1, scope2) {
	return compareTokenLocations(scope1.assignToken, scope2.assignToken);
};