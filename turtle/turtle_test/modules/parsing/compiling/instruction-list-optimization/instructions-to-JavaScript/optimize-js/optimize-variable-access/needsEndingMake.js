import { isAfterOrSame } from
'../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { isJSVariableDeclareAssignment } from '../token-classifiers/isJSVariableDeclareAssignment.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';

function isAtTopLevel(token) {
	if (token === undefined)
		return false;
	return token.parentNode.type === ParseTreeTokenType.TREE_ROOT;
}

function getLastToken(tokens) {
	let result;
	for (let i = 0; i < tokens.length; i++) {
		const tok = tokens[i];
		if (result === undefined || isAfterOrSame(tok, result)) {
			result = tok;
		}
	}
	return result;
}

function getLastUnconditionalAssignment(tokens) {
	tokens = tokens.filter(isAtTopLevel);
	return getLastToken(tokens);
}

function isAssignmentOfInterest(token) {
	return !isJSVariableDeclareAssignment(token);
}

function makeTokenToStatementRoot(makeToken) {
	if (makeToken.type === ParseTreeTokenType.IDENTIFIER)
		return undefined;
	return makeToken.parentNode.parentNode;
}

export function needsEndingMake(variableInfo) {
	//const nonDeclarationAssignments = variableInfo.assignTokens.filter(t => !isJSVariableDeclareAssignment(t));
	const lastUnconditionalMake = getLastToken(variableInfo.makeTokens.filter(t => isAtTopLevel(makeTokenToStatementRoot(t))));
	const lastAssignment = getLastToken(variableInfo.assignTokens.filter(isAssignmentOfInterest));
	if (lastUnconditionalMake === undefined) {
		return lastAssignment !== undefined;
	}
	if (lastAssignment !== undefined && isAfterOrSame(lastAssignment, lastUnconditionalMake))
		return true;
	return false;
};