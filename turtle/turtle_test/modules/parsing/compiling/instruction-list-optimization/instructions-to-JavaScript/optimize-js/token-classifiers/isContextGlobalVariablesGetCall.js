import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
Checks for something like:
context.globalVariables.get("x")

This is similar to isContextGlobalVariableRead except isContextGlobalVariablesGetCall looks 
for the function call token associated with the code.
*/
export function isContextGlobalVariablesGetCall(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL || token.children.length !== 2)
		return false;
	const context = token.children[0];
	if (context.val !== 'context' || context.type !== ParseTreeTokenType.IDENTIFIER || context.children.length !== 1)
		return false;
	let dot = context.children[0];
	if (dot.type !== ParseTreeTokenType.DOT || dot.children.length !== 1)
		return false;
	token = dot.children[0];
	if (token.val !== 'globalVariables' || token.type !== ParseTreeTokenType.IDENTIFIER || token.children.length !== 1)
		return false;
	dot = token.children[0];
	if (dot.type !== ParseTreeTokenType.DOT || dot.children.length !== 1)
		return false;
	token = dot.children[0];
	if (token.val !== 'get' || token.type !== ParseTreeTokenType.IDENTIFIER || token.children.length !== 0)
		return false;
	return true;
};