import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isNoContextGlobalVariablesSetCall(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL || token.children.length !== 2)
		return false;
	const argList = token.children[1];
	if (argList.children.length !== 5)
		return false;
	token = token.children[0];
	if (token.val !== 'globalVariables' || token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.DOT)
		return false;
	token = token.children[0];
	if (token.val !== 'set' || token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 0)
		return false;
	return true;
};