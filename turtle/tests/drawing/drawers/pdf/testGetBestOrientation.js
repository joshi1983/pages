import { getBestOrientation } from '../../../../modules/drawing/drawers/pdf/getBestOrientation.js';
import { PDFDrawer } from '../../../../modules/drawing/drawers/PDFDrawer.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetBestOrientation(logger) {
	const cases = [
		{'in': [1, 2], 'result': 'p'},
		{'in': [2, 1], 'result': 'l'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in = ${JSON.stringify(caseInfo.in)}`, logger);
		const pdfDrawer = new PDFDrawer(caseInfo.in[0], caseInfo.in[1]);
		const result = getBestOrientation(pdfDrawer);
		if (result !== caseInfo.result)
			plogger(`Expected ${caseInfo.result} but got ${result}`);
	});
};