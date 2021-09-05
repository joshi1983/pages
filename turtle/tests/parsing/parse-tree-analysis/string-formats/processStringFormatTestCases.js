import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function processStringFormatTestCases(cases, logger, func) {
	if (!(cases instanceof Array))
		throw new Error(`cases must be an Array but got ${cases}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but got ${logger}`);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = func(caseInfo.s);
		if ((typeof result === 'string') !== caseInfo.error)
			plogger(`s: "${caseInfo.s}" Expected error? ${caseInfo.error} but got validation message of "${result}"`);
	});
};