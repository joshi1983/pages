import { filterBracketsAndCommas } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { JSProcessingFunctions } from
'../../JSProcessingFunctions.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { processSpecialFunctionCall } from
'./function-calls/processSpecialFunctionCall.js';
import { processTokens } from
'./helpers/processTokens.js';

export function processFunctionCall(token, result, settings) {
	if (processSpecialFunctionCall(token, result, settings))
		return;

	const nameToken = token.children[0];
	if (nameToken.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 2) {
		const argList = token.children[1];
		const children = filterBracketsAndCommas(argList.children);
		const numArgs = children.length;
		const functionInfo = JSProcessingFunctions.getFunctionInfo(nameToken.val, numArgs);
		if (functionInfo !== undefined && functionInfo.length !== 0 && functionInfo[0].removeInMigration)
			return;

		if (functionInfo === undefined || functionInfo.length === 0) {
			result.append(` ${nameToken.val} `);
		}
		else {
			const funcInfo = functionInfo[0];
			if (funcInfo.toProc)
				result.append(` ${funcInfo.toProc} `);
			
		}
		if (argList !== undefined) {
			processTokens(children, result, settings);
		}
	}
};