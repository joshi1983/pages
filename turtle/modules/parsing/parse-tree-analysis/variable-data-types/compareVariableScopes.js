import { compareTokenLocations } from '../../compareTokenLocations.js';

export function compareVariableScopes(scope1, scope2) {
	return compareTokenLocations(scope1.assignToken, scope2.assignToken);
};