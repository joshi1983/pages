import { createTestPDFDrawing } from '../../../helpers/createTestPDFDrawing.js';
import { createTestPostScriptDrawing } from '../../../helpers/createTestPostScriptDrawing.js';
import { isDrawableToPDF } from '../../../../modules/drawing/drawers/pdf/isDrawableToPDF.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testIsDrawableToPDF(logger) {
	const cases = [
		{'drawing': createTestPDFDrawing(), 'result': true},
		{'drawing': createTestPostScriptDrawing(), 'result': false},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = isDrawableToPDF(caseInfo.drawing);
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but got ${result}`);
	});
};