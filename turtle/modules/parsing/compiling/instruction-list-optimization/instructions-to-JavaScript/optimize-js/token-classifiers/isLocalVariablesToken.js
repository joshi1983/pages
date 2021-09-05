import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isGetCurrentExecutingProcedureCall(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (token.val !== 'getCurrentExecutingProcedure')
		return false;
	let p = token.parentNode;
	if (p.type !== ParseTreeTokenType.DOT)
		return false;
	p = p.parentNode;
	if (p.type !== ParseTreeTokenType.IDENTIFIER ||
	p.val !== 'context')
		return false;
	return true;
};

export function isLocalVariablesToken(token) {
	if (token.val !== 'localVariables' || token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let parent = token.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.DOT)
		return false;
	parent = parent.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.EXPRESSION_DOT)
		return false;
	parent = parent.children[0];
	if (parent === undefined || parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	parent = parent.children[0];
	if (parent === undefined || parent.type !== ParseTreeTokenType.IDENTIFIER || parent.val !== 'context')
		return false;
	parent = parent.children[0];
	if (parent === undefined || parent.type !== ParseTreeTokenType.DOT)
		return false;
	parent = parent.children[0];
	if (!isGetCurrentExecutingProcedureCall(parent))
		return false;
	return true;
};