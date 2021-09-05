import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isBeginFillCall } from
'./isBeginFillCall.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function mightCallBeginFill(tok, customFuncNames, funcNamesThatDoNotBeginFills) {
	if (tok.type === ParseTreeTokenType.FUNCTION_DEFINITION)
		return false; // a function definition is will not execute on its own.

	if (tok.type === ParseTreeTokenType.FUNCTION_CALL && funcNamesThatDoNotBeginFills.has(tok.val))
		return false;

	if (isBeginFillCall(tok))
		return true;

	const funcCalls = getDescendentsOfType(tok, ParseTreeTokenType.FUNCTION_CALL);
	if (funcCalls.some(isBeginFillCall))
		return true;

	const customFuncCalls = funcCalls.filter(t => customFuncNames.has(t.val));
	if (!customFuncCalls.some(t => !funcNamesThatDoNotBeginFills.has(funcNamesThatDoNotBeginFills)))
		return false;
	
	return true;
};