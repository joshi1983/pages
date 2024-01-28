import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
Checks if token represents the function call in JavaScript code like
globalVariables.get("x")
*/
export function isGlobalVariablesGetCall(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL || token.children.length !== 2)
		return false;
	token = token.children[0];
	if (token.val !== 'globalVariables' || token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.DOT)
		return false;
	token = token.children[0];
	if (token.val !== 'get' || token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 0)
		return false;
	return true;
};