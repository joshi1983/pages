import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
Checks for something like:
context.globalVariables.set("x", 3)

This is similar to isContextGlobalVariableRead except isContextGlobalVariablesSetCall looks 
for the function call token associated with the code.
*/
export function isContextGlobalVariablesSetCall(token) {
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
	if (token.val !== 'set' || token.type !== ParseTreeTokenType.IDENTIFIER || token.children.length !== 0)
		return false;
	return true;
};