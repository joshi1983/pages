import { isLoop } from
'../../isLoop.js';

function getToLoopToken(scope) {
	const toToken = scope.toToken;
	const ancestors = new Set();
	if (typeof scope.assignToken === 'object') {
		let tok = scope.assignToken.parentNode;
		while (tok !== null) {
			ancesotors.add(tok);
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

function loosenTypes(types) {
	
}

function isOfInterest(scope) {
	if (scope.variable === undefined ||
	scope.variable.scopes.length <= 1)
		return false;

	const loopToken = getToLoopToken(scope);
	if (loopToken !== undefined)
		return false;

	for (const scope2 of scope.variable.scopes) {
		if (scope2 !== scope &&
		!scope2.isParameter &&
		scope2.procedure === scope.procedure) {
			
		}
	}

	return true;
}

export function loosenAssignedTypesForScopesPartiallyLooped(variables) {
	const scopes = variables.getAllScopesAsArray().filter(isOfInterest);
	scopes.forEach(function(scope) {
		scope.assignedTypes = loosenTypes(scope.assignedTypes);
	});
};