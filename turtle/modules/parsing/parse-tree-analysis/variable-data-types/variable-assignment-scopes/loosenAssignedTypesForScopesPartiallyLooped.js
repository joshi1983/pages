import { DataTypes } from
'../../../data-types/DataTypes.js';
import { isLoop } from
'../../isLoop.js';

function getToLoopToken(scope) {
	const toToken = scope.toToken;
	const ancestors = new Set();
	if (typeof scope.assignToken === 'object') {
		let tok = scope.assignToken.parentNode;
		while (tok !== null) {
			ancestors.add(tok);
			tok = tok.parentNode;
		}
	}

	let tok = toToken.parentNode;
	while (tok !== null) {
		if (ancestors.has(tok))
			return;

		if (isLoop(tok))
			return tok;

		tok = tok.parentNode;
	}
}

function isOfInterest(scope) {
	if (scope.variable === undefined ||
	scope.variable.scopes.length <= 1)
		return false;

	const loopToken = getToLoopToken(scope);
	if (loopToken !== undefined)
		return false;

	return scope.variable.scopes.some(isConnected(scope));
}

function isConnected(scope) {
	return function(scope2) {
		// The exact same scope is not of interest.
		// We don't want to union types of scope.assignTypes with scope.assignTypes.
		if (scope === scope2)
			return false;

		if (scope2 !== scope &&
		!scope2.isParameter &&
		scope2.procedure === scope.procedure) {
			if (scope2.contains(scope.assignToken, scope.procedure)) {
				return true;
			}
		}
		return false;
	};
}

export function loosenAssignedTypesForScopesPartiallyLooped(variables) {
	const scopes = variables.getAllScopesAsArray().filter(isOfInterest);
	scopes.forEach(function(scope) {
		const otherScopes = scope.variable.scopes.filter(isConnected(scope));
		for (const otherScope of otherScopes) {
			if (otherScope.assignedTypes !== null)
				scope.assignedTypes = new DataTypes(DataTypes.union(scope.assignedTypes.types,
					otherScope.assignedTypes.types));
		}
	});
};