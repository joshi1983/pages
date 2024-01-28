import { compareParseTokens } from '../../compareParseTokens.js';
import { getInstructionListChildToken } from '../../getInstructionListChildToken.js';

function findInstruction(location) {
	if (location.parentNode === undefined)
		return location;
	const i = getInstructionListChildToken(location);
	return i;
}

function removeImpossibleScopesFor(variableScopes, location, procedure) {
	if (typeof procedure.getInstructionListToken !== 'function')
		throw new Error(`procedure expected to be a Procedure but got ${procedure}`);
	let token = procedure.getInstructionListToken();
	if (token === undefined)
		return variableScopes;
	const children = token.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (compareParseTokens(child, location) >= 0) {
			return variableScopes.filter(s => compareParseTokens(child, s.assignToken) > 0);
		}
	}
	return variableScopes;
}

export function findGlobalAssignmentScopesInProcedureAt(variableScopes, location, procedure) {
	if (typeof procedure !== 'object')
		throw new Error(`procedure expected to be an object but got ${procedure}`);
	variableScopes = variableScopes.filter(s => s.procedure === undefined &&
		s.assignTokenProcedure !== undefined &&
		s.assignTokenProcedure.name === procedure.name);
	variableScopes = removeImpossibleScopesFor(variableScopes, location, procedure);
	if (variableScopes.length > 1) {
		// remove scopes that are assigned in the same command that includes location.
		variableScopes = variableScopes.filter(s => compareParseTokens(s.assignToken, findInstruction(location)) !== 0);
	}
	return variableScopes;
};