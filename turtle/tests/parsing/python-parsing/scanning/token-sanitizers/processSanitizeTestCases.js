import { compareScanTokensInfo } from
'../../../../helpers/parsing/compareScanTokensInfo.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { scan } from
'../../../../../modules/parsing/python-parsing/scanning/scan.js';

export function processSanitizeTestCases(cases, sanitize, logger) {
	if (typeof sanitize !== 'function')
		throw new Error(`sanitize must be a function but found ${sanitize}`);
	cases.forEach(function(caseInfo, index) {
		const tokens = scan(caseInfo.code);
		sanitize(tokens);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		compareScanTokensInfo(tokens, caseInfo.tokens, plogger);
	});
};