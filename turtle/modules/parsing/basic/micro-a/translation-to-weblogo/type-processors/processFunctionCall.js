import { Colour } from
'../../../../../Colour.js';
import { evaluateToken } from
'../../../qbasic/evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'../../../qbasic/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { isNumber } from
'../../../../../isNumber.js';
import { MicroAInternalFunctions } from
'../../MicroAInternalFunctions.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';
import { processToken } from
'../../../qbasic/translation-to-weblogo/type-processors/processToken.js';
import { isSpecialFunctionApplicableTo, specialFunctionCall } from
'./function-calls/specialFunctionCall.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

function getColor(argTokens) {
	argTokens = filterBracketsAndCommas(argTokens);
	const vals = argTokens.map(evaluateToken);
	if (vals.length !== 3 || vals.some(v => !isNumber(v) || v < 0))
		return;
	const c = new Colour(vals);
	return c.to6DigitHTMLCode();
}

export function isApplicableTo(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;

	const children = token.children;
	if (children.length !== 2)
		return false;

	const nameToken = children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	nameToken.children.length !== 0)
		return false;

	const argList = token.children[1];
	if (argList.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	
	const info = MicroAInternalFunctions.getFunctionInfo(nameToken.val);
	if (info !== undefined) {
		if (info.to !== undefined || info.toProc !== undefined)
			return true;
	}
	if (isSpecialFunctionApplicableTo(token))
		return true;
	return false;
};

export function processFunctionCall(token, result, options) {
	if (isSpecialFunctionApplicableTo(token)) {
		specialFunctionCall(token, result, options);
		return;
	}
	const children = token.children;
	const nameToken = children[0];
	const info = MicroAInternalFunctions.getFunctionInfo(nameToken.val);
	if (info.to !== undefined)
		result.append(info.to);
	else if (info.toProc !== undefined) {
		result.append(info.toProc);
	}
	const args = children[1].children;
	if (info.translateAllParametersToSingleColor === true) {
		const singleColorValue = getColor(args);
		if (singleColorValue !== undefined) {
			result.append(valueToLiteralCode(singleColorValue) + ' ');
			return;
		}
	}
	let wrapWithSquareBrackets = info.translateAllParametersToSingleColor === true;
	if (wrapWithSquareBrackets)
		result.append(' [ ');

	for (const child of args) {
		processToken(child, result, options);
	}
	if (wrapWithSquareBrackets)
		result.append(' ] ');
};