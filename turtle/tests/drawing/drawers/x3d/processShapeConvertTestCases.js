import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { StringBuffer } from '../../../../modules/StringBuffer.js';

export function processShapeConvertTestCases(cases, converter, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const buffer = new StringBuffer();
		converter(caseInfo.shape, buffer);
		if (caseInfo.substringChecks !== undefined) {
			const result = buffer.toString();
			caseInfo.substringChecks.forEach(function(substring) {
				if (result.indexOf(substring) === -1)
					plogger(`Expected to find ${substring} but did not in ${result}`);
			});
		}
	});
};