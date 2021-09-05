import { filterBracketsAndCommas } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { JSProcessingFunctions } from
'../../JSProcessingFunctions.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { processArgsAsSingleColor } from
'./processArgsAsSingleColor.js';
import { processSpecialFunctionCall } from
'./function-calls/processSpecialFunctionCall.js';
import { processFunctionCall as processFunctionCallJS } from
'../../../../js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { processToken } from
'./processToken.js';

const generalJSProcessFunctionCall = processFunctionCallJS(processToken);

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

		if (functionInfo === undefined || functionInfo.length === 0) {
			generalJSProcessFunctionCall(token, result, settings);
			return;
		}
		if (functionInfo[0].removeInMigration)
			return;

		const funcInfo = functionInfo[0];
		if (funcInfo.toProc)
			result.append(` ${funcInfo.toProc} `);

		if (argList !== undefined) {
			if (funcInfo.translateAllParametersToSingleColor) {
				if (processArgsAsSingleColor(children, result)) {
					return;
				}
				if (children.length === 1) {
					result.append('getColor_1 ');
				}
				else if (children.length === 3)
					result.append('getColor_3 ');
			}
			for (const child of children) {
				processToken(child, result, settings);
				result.append(' ');
			}
		}
	}
};