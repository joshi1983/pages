import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function createFunctionCall(identifierToken, argListPos) {
	if (argListPos === undefined) {
		argListPos = {
			'lineIndex': identifierToken.lineIndex,
			'colIndex': identifierToken.colIndex + 1
		};
	}
	const funcCall = new ParseTreeToken(null, identifierToken.lineIndex, identifierToken.colIndex, ParseTreeTokenType.FUNCTION_CALL);
	const argList = new ParseTreeToken(null, argListPos.lineIndex, argListPos.colIndex, ParseTreeTokenType.ARG_LIST);
	const prevParent = identifierToken.parentNode;
	if (identifierToken.parentNode !== null)
		identifierToken.remove();
	funcCall.appendChild(identifierToken);
	funcCall.appendChild(argList);
	if (prevParent !== null)
		prevParent.appendChild(funcCall);
	return [funcCall, argList];
};