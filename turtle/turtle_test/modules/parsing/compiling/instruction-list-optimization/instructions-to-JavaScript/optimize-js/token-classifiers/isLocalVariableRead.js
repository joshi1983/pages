import { isVariableReadBasic } from './isVariableReadBasic.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

// Checks if the token is the string literal in a chain similar to:
// context.getCurrentExecutingProcedure().localVariables.get("x")
// or
// localVariables.get("x")
export function isLocalVariableRead(token) {
	if (!isVariableReadBasic(token))
		return false;
	let p = token.parentNode.parentNode.children[0];
	if (p.val !== 'localVariables') {
		p = p.children[1];
		if (p === undefined)
			return false;
		p = p.children[0];
	}
	if (p === undefined || p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'localVariables')
		return false;
	return true;
};