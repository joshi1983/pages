import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function convertToFunctionCall(token) {
	const funcCall = new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.FUNC_CALL);
	const argList = new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.ARG_LIST);
	const tokenParent = token.parentNode;
	tokenParent.replaceChild(token, funcCall);
	funcCall.appendChild(token);
	funcCall.appendChild(argList);
};