import { MigrationInfo } from
'../MigrationInfo.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function processIdentifier(prev, next) {
	const info = MigrationInfo.getFunctionInfo(next.val);
	if (info !== undefined) {
		const functionCall = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.FUNCTION_CALL);
		functionCall.appendChild(next);
		prev.appendChild(functionCall);
		const argList = new ParseTreeToken(null, next.lineIndex, next.colIndex,
		ParseTreeTokenType.ARG_LIST);
		functionCall.appendChild(argList);
		if (info.args !== undefined && info.args.length === 0)
			return functionCall;

		return argList;
	}
	prev.appendChild(next);
	return next;
};