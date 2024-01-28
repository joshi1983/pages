import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

function isDotLocalVariablesGet(token) {
	if (token.type !== ParseTreeTokenType.DOT || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'localVariables' || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.DOT || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'get' || token.children.length !== 0)
		return false;
	return true;
}

/*
Looks for tokens from code like:
context.getCurrentExecutingProcedure().localVariables.get("colorindex")
*/
export function isContextLocalVariablesGet(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL ||
	token.children.length !== 2)
		return false;
	const argList = token.children[1];
	if (argList.children.length !== 3)
		return false;
	const expressionDot = token.children[0];
	if (expressionDot.type !== ParseTreeTokenType.EXPRESSION_DOT || expressionDot.children.length !== 2)
		return false;
	if (!isDotLocalVariablesGet(expressionDot.children[1]))
		return false;

	token = expressionDot.children[0];
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL ||
	token.children.length !== 2)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'context' || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.DOT || token.val !== '.' || token.children.length !== 1)
		return false;
	token = token.children[0];
	if (token.type !== ParseTreeTokenType.IDENTIFIER || token.val !== 'getCurrentExecutingProcedure' || token.children.length !== 0)
		return false;
	return true;
};