import { compareScanTokensInfo } from '../helpers/parsing/compareScanTokensInfo.js';
import { exceptionToString } from '../../modules/exceptionToString.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function processScanTokensTestCases(scan) { 
	return function(cases, processTokens, logger) {
		cases.forEach(function(caseInfo, index) {
			if (caseInfo.len === undefined && caseInfo.tokens instanceof Array)
				caseInfo.len = caseInfo.tokens.length;
			const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
			try {
				const result = scan(caseInfo.code);
				processTokens(result);
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
			} catch (e) {
				console.error(e);
				plogger(`Error thrown ${exceptionToString(e)}`);
			}
		});
	};
};