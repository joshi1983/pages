import { processSanitizeTokensTestCases } from
'../processSanitizeTokensTestCases.js';

export function processTokenSanitizersTestCases(cases, func, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but found ${cases}`);
	if (typeof func !== 'function')
		throw new Error(`func must be a function but found ${func}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	processSanitizeTokensTestCases(cases, function(tokens) {
		const customFunctionNames = new Set();
		func(tokens, customFunctionNames);
	}, logger);
};