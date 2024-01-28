import { compareParseTokens } from '../compareParseTokens.js';
import { getLastSingleValueTokenForControlStructure } from './getLastSingleValueTokenForControlStructure.js';

function isIntersectingAnotherScope(variable, scope, procedure) {
	return variable.getScopesArray().
		some(s => s.procedure === procedure && s.isSingleValueApplicableAt(scope.assignToken));
}

function getClosestFromToken(token, variable, scope, cachedParseTree) {
	const procedure = cachedParseTree.getProcedureAtToken(token);
	if (isIntersectingAnotherScope(variable, scope, procedure))
		return scope.assignToken;
	token = getLastSingleValueTokenForControlStructure(cachedParseTree, variable, scope, procedure, token);
	const scopes = variable.getScopesArray().filter(_scope => _scope !== scope &&
		compareParseTokens(_scope.fromToken, scope.assignToken) >= 0 &&
		_scope.procedure === procedure);
	let isUpdated = false;
	scopes.forEach(function(_scope) {
		if (compareParseTokens(_scope.fromToken, token) < 0) {
			token = _scope.fromToken;
			isUpdated = true;
		}
	});
	if (isUpdated)
		return cachedParseTree.getTokenImmediatelyBefore(token);
	return token;
}

export function getLastSingleValueTokenForScope(scope, token, cachedParseTree) {
	const variable = scope.variable;
	if (variable !== undefined) {
		return getClosestFromToken(token, variable, scope, cachedParseTree);
	}
	else
		return token;
};