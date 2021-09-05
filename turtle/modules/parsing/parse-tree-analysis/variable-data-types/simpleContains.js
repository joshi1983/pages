import { compareTokenLocations } from '../../parse-tree-token/compareTokenLocations.js';

/*
scopeOrRange can be a VariableAssignmentScope or ConditionalRange.
location should be a ParseTreeToken or similar type of object.
*/
export function simpleContains(scopeOrRange, location) {
	return compareTokenLocations(scopeOrRange.fromToken, location) <= 0 &&
			compareTokenLocations(scopeOrRange.toToken, location) >= 0;
};