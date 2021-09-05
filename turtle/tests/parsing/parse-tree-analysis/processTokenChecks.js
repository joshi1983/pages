import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function processTokenChecks(cases, func, logger) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array.  Not: ${cases}`);
	if (typeof func !== 'function')
		throw new Error(`func must be a function.  Not: ${func}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function.  Not: ${logger}`);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = tree.getAllTokens();
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const cplogger = prefixWrapper(`Check ${cIndex}`, plogger);
			const token = findToken(checkInfo, allTokens, cplogger);
			if (token !== undefined) {
				const result = func(token);
				if (result !== checkInfo.out)
					cplogger(`Expected ${checkInfo.out} but got ${result}`);
			}
		});
	});
};