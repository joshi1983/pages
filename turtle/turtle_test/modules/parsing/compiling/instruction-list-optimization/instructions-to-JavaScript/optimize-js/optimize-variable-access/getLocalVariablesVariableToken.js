import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

function isLocalVariablesAssignmentToken(token) {
	if (token.val !== 'localVariables' || token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let p = token.parentNode;
	if (p.val !== '=' || p.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return false;
	return true;
}

export function getLocalVariablesVariableToken(tokens) {
	if (!(tokens instanceof Array))
		throw new Error(`tokens expected to be an Array but got ${tokens}`);
	const matchedTokens = tokens.filter(isLocalVariablesAssignmentToken);
	return matchedTokens[0];
};