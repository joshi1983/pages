import { ParseTreeTokenType } from
'../../../../../ParseTreeTokenType.js';

function isFunctionishToken(token) {
	if (token.type === ParseTreeTokenType.FUNCTION ||
	token.type === ParseTreeTokenType.CONSTRUCTOR ||
	(token.val === '=>' &&
	token.type === ParseTreeTokenType.BINARY_OPERATOR))
		return true;
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = token.parentNode;
		if (parent.type === ParseTreeTokenType.CLASS_BODY ||
		parent.type === ParseTreeTokenType.ASYNC ||
		parent.type === ParseTreeTokenType.STATIC)
			return true;
	}
	return false;
}

export function isDefiningInFunctionNotAccessibleFromIdentifier(definingToken, identifier) {
	let closestDefiningFunctionToken = definingToken.parentNode;
	while (closestDefiningFunctionToken !== null &&
	!isFunctionishToken(closestDefiningFunctionToken))
		closestDefiningFunctionToken = closestDefiningFunctionToken.parentNode;

	if (closestDefiningFunctionToken === null)
		return false;

	if (closestDefiningFunctionToken.type === ParseTreeTokenType.FUNCTION &&
	closestDefiningFunctionToken === definingToken.parentNode &&
	closestDefiningFunctionToken.children.indexOf(definingToken) === 0) {
		// defining a function and definingToken represents the function's name.
		return false;
	}

	let tok = identifier.parentNode;
	while (tok !== null) {
		if (tok === closestDefiningFunctionToken)
			return false;

		tok = tok.parentNode;
	}

	return true;
};