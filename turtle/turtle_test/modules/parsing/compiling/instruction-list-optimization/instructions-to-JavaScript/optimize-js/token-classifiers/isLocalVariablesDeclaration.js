import { declaringTypes } from '../optimize-variable-access/declaringTypes.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isLocalVariablesDeclaration(token) {
	if (token.val !== 'localVariables' || token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let p = token.parentNode;
	if (p === null || p.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR || p.val !== '=')
		return false;
	p = p.parentNode;
	if (p === null || !declaringTypes.has(p.type))
		return false;
	return true;
};