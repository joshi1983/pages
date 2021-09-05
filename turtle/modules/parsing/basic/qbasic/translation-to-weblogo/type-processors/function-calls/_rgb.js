import { callTokenToArgValueTokens } from
'../helpers/callTokenToArgValueTokens.js';
import { functionCallToFunctionName } from
'../../../parsing/functionCallToFunctionName.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processTokens } from
'../helpers/processTokens.js';
import { QBasicInternalFunctions } from
'../../../QBasicInternalFunctions.js';

function shouldTranslateToList(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const gParent = parent.parentNode;
	if (gParent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const name = functionCallToFunctionName(gParent);
	const info = QBasicInternalFunctions.getFunctionInfo(name);
	if (info === undefined ||
	info.mightUseColor !== true)
		return false;

	return true;
}

export function getToName(token) {
	if (shouldTranslateToList(token))
		return;
	else {
		const args = callTokenToArgValueTokens(token);
		if (args.length === 1)
			return '_rgb32FromIntensity';
		else if (args.length === 2)
			return '_rgb32FromIntensityAlpha';
		else if (args.length === 3)
			return '_rgb32_3';
		else if (args.length >= 4)
			return '_rgba32';
	}
};

export function _rgb(token, result, options) {
	const args = callTokenToArgValueTokens(token);
	if (shouldTranslateToList(token)) {
		result.append(' [ ');
		processTokens(args, result, options);
		result.append(' ] ');
	}
	else {
		const name = getToName(token);
		result.append(` ${name} `);
		processTokens(args, result, options);
	}
};