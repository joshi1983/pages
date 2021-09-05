import { getJSPDFFormat } from '../../../../modules/drawing/drawers/pdf/getJSPDFFormat.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetJSPDFFormat(logger) {
	const cases = [
		{'in': [8.5, 11], 'result': 'letter'},
		{'in': [8.5, 14], 'result': 'legal'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = getJSPDFFormat(caseInfo.in[0], caseInfo.in[1]);
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but got ${result}`);
	});
};