import { ParseTreeTokenType } from './ParseTreeTokenType.js';

const parentTypesForIdentifier = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.LET,
]);

const formalParameterGrandParentTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB
]);

/*
shouldBooleanLiteralBecomeIdentifier tackles some cases where 
shouldBooleanLiteralsBeIdentifiers incorrectly returns false.
*/
export function shouldBooleanLiteralBecomeIdentifier(token, previousTokenChangedToIdentifier) {
	if (token.type !== ParseTreeTokenType.BOOLEAN_LITERAL)
		return false;
	const parent = token.parentNode;
	if (parentTypesForIdentifier.has(parent.type))
		return true;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT &&
	parent.children.indexOf(token) === 0)
		return true;
	if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const gParent = parent.parentNode;
		if (formalParameterGrandParentTypes.has(gParent.type))
			return true;
	}

	return previousTokenChangedToIdentifier;
};