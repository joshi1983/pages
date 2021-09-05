import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function convertToFunctionCallWithFirstArgToken(prev, next, functionsMap) {
	const funcCall = new ParseTreeToken(null,
		next.lineIndex, next.colIndex,
		ParseTreeTokenType.FUNCTION_CALL);
	const prevParent = prev.parentNode;
	prevParent.replaceChild(prev, funcCall);
	prev.remove();
	funcCall.appendChild(prev);
	const argList = new ParseTreeToken(null,
		next.lineIndex, next.colIndex,
		ParseTreeTokenType.ARG_LIST);
	argList.appendChild(next);
	funcCall.appendChild(argList);
	return argList;
};