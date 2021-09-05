import { getDeclarationsFor } from
'../helpers/getDeclarationsFor.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

function isDeclarationConst(token) {
	if (token.type !== ParseTreeTokenType.CONST)
		return false;
	return true;
}

function isDeclarationApplicableTo(identifierToken) {
	const parent = identifierToken.parentNode;
	const grandparent = parent.parentNode;
	return function(declarationToken) {
		if (parent === declarationToken ||
		grandparent === declarationToken)
			return true;
		return false;
	};
}

function isConstViolatedByAssignment(identifierToken) {
	if (identifierToken.children.length !== 0)
		return false;
		// x.y = 3 is ok even if x is const.

	// look for any potentially associated variable declarations
	const declarations = getDeclarationsFor(identifierToken);
	if (declarations.length === 0)
		return false;

	if (declarations.some(isDeclarationApplicableTo(identifierToken))) {
		const parent = identifierToken.parentNode;
		if (parent.val === '=')
			return false;
			// for example, const x = 3;
			// The x = 3 is not a problem if it is initializing in a const.

		return true;
			// +=, -=, *=, /=... are not valid in a const statement.
	}

	return !declarations.some(t => !isDeclarationConst(t));
}

export function validateAssignmentOperator(token, parseLogger) {
	const children = token.children;
	const firstChild = children[0];
	if (firstChild !== undefined &&
	firstChild.type === ParseTreeTokenType.IDENTIFIER) {
		if (isConstViolatedByAssignment(firstChild)) {
			parseLogger.error(`${firstChild.val} is const but you are assigning a value to it using the ${token.val} operator here.  That is not allowed`, firstChild);
		}
	}
};