import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

const nonIdentifierReadParentTypes = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.FUNCTION_CALL,
]);
const nonIdentifierVals = new Set(['context', 'localVariables']);

/*
Checks if token could be reading a JavaScript variable.
*/
export function isIdentifierReadToken(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER || nonIdentifierVals.has(token.val))
		return false;
	const parent = token.parentNode;
	if (parent === null || nonIdentifierReadParentTypes.has(parent.type))
		return false;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && parent.children.indexOf(token) === 0) {
		return false;
	}
	return true;
};