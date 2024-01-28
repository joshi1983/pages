import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function isContextReadVariableCall(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL || token.children.length !== 2)
		return false;
	const context = token.children[0];
	if (context.val !== 'context' || context.type !== ParseTreeTokenType.IDENTIFIER || context.children.length !== 1)
		return false;
	const dot = context.children[0];
	if (dot.type !== ParseTreeTokenType.DOT || dot.children.length !== 1)
		return false;
	const readVariable = dot.children[0];
	if (readVariable.val !== 'readVariable' || readVariable.type !== ParseTreeTokenType.IDENTIFIER || readVariable.children.length !== 0)
		return false;
	return true;
};