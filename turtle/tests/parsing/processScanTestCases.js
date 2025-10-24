import { compareScanTokensInfo } from '../helpers/parsing/compareScanTokensInfo.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function processScanTestCases(cases, scan, logger) {
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.len === undefined && caseInfo.tokens instanceof Array)
			caseInfo.len = caseInfo.tokens.length;
		const result = scan(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		if (!(result instanceof Array))
			plogger(`Expected result to be an Array but got ${result}`);
		else if (result.length !== caseInfo.len) {
			plogger(`Expected length of ${caseInfo.len} but got ${result.length}, result strings = "${result.map(t => t.s).join('", "')}"`);
		}
		else {
			if (caseInfo.tokens instanceof Array) {
				compareScanTokensInfo(result, caseInfo.tokens, plogger);
			}
		}
	});
};