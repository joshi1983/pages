import { compareTokenLocations } from '../../../parse-tree-token/compareTokenLocations.js';
import { findGlobalAssignmentScopesInProcedureAt } from './findGlobalAssignmentScopesInProcedureAt.js';
import { getInstructionListChildToken } from '../../getInstructionListChildToken.js';
import { isLoop } from '../../isLoop.js';

/*
Some of this code is similar to methods from the Variable class.
The superficially duplicate code is here because it is subtly different.
The fromToken and toToken in VariableAssignmentScope is narrowed sometimes for property list variables.
It is narrowed to let singleValue be used for color stops in gradients and more thorough validation of them.
This extra code is to help us continue thoroughly validating variable references to undefined property lists.
*/
function getLoopAncestors(token) {
	const loops = new Set();
	while (token !== null) {
		if (isLoop(token))
			loops.add(token);
		token = token.parentNode;
	}
	return loops;
}

function sharingLoopAncestor(token1, token2) {
	const token1Loops = getLoopAncestors(token1);
	while (token2 !== null) {
		if (token1Loops.has(token2))
			return true;
		token2 = token2.parentNode;
	}
	return false;
}

function sharingClosestInstructionList(token1, token2) {
	token1 = getInstructionListChildToken(token1);
	token2 = getInstructionListChildToken(token2);
	return token1.parentNode === token2.parentNode;
}

function mightBeApplicable(cachedParseTree, token) {
	const procedure = cachedParseTree.getProcedureAtToken(token);
	return function(scope) {
		if (scope.procedure !== undefined) {
			// local scope(assigned within a procedure or could be a parameter)
			if (procedure === undefined)
				return false;
			if (procedure !== undefined && procedure.name !== scope.procedure.name)
				return false;
			if (compareTokenLocations(scope.toToken, token) < 0)
				return false;
		}
		else if (scope.assignTokenProcedure === undefined && procedure === undefined) {
			// token is not in a procedure and scope is not assigned within a procedure.
			if (compareTokenLocations(scope.toToken, token) < 0)
				return false;
		}

		// is token and scope.assignToken in a common loop?
		if (token.parentNode !== scope.parentNode &&
		!sharingClosestInstructionList(token, scope.assignToken) &&
		sharingLoopAncestor(token, scope.assignToken))
			return true;
		return compareTokenLocations(scope.assignToken, token) < 0;
	};
}

export function filterVariableScopesDeclaredAt(cachedParseTree, scopes, token) {
	const result = scopes.filter(mightBeApplicable(cachedParseTree, token));
	if (result.length !== 1) {
		const proc = cachedParseTree.getProcedureAtToken(token);
		if (proc !== undefined)
			return findGlobalAssignmentScopesInProcedureAt(scopes, token, proc);
	}
	return result;
};