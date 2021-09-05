import { declaringTypes } from
'../../../../../../../parsing/js-parsing/parsing/declaringTypes.js';
import { getDescendentsOfTypes } from
'../../../../../../../parsing/generic-parsing-utilities/getDescendentsOfTypes.js';
import { getClosestOfType } from
'../../../../../../../parsing/generic-parsing-utilities/getClosestOfType.js';
import { getParameterNamesFromFunctionArguments } from './getParameterNamesFromFunctionArguments.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

function getVariableName(token) {
	while (token.children.length !== 0)
		token = token.children[0];
	return token.val;
}

function isDeclarationMatchingVariableName(varName) {
	return function(declareToken) {
		const children = declareToken.children.filter(c => c.type !== ParseTreeTokenType.COMMA);
		for (let mutatedVarNameToken of children) {
			if (mutatedVarNameToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
			mutatedVarNameToken.children.length !== 0)
				mutatedVarNameToken = mutatedVarNameToken.children[0];
			if (mutatedVarNameToken.val === varName)
				return true;
		}
		return false;
	};
}

export function isAssigningToLocalVariable(varNameToken) {
	const varName = getVariableName(varNameToken);
	if (typeof varName !== 'string')
		return false;
	const funcToken = getClosestOfType(varNameToken, ParseTreeTokenType.FUNCTION);
	if (funcToken === null)
		return false; // can't be a local variable if not in a function's implementation
	const paramNames = getParameterNamesFromFunctionArguments(funcToken.children[1]);
	if (paramNames.indexOf(varName) !== -1)
		return true; // definitely local since a parameter with the same name exists.

	const declarations = getDescendentsOfTypes(funcToken, declaringTypes);
	// We don't really know if token is local.
	return declarations.some(isDeclarationMatchingVariableName(varName));
};