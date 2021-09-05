import { functionCallToFunctionName } from
'../parsing/functionCallToFunctionName.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../QBasicInternalFunctions.js';

function mightUseColor(callToken) {
	const name = functionCallToFunctionName(callToken);
	const info = QBasicInternalFunctions.getFunctionInfo(name);
	return info !== undefined &&
		info.mightUseColor === true;
}

export function shouldIgnoreScreenCalls(root) {
	// is any function called that could reference a color?
	return !getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).some(mightUseColor);
};