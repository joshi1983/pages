import { assertEquals } from
'../../../helpers/assertEquals.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { QBasicColors } from
'../../../../modules/parsing/basic/qbasic/QBasicColors.js';

export function testQBasicColors(logger) {
	const data = QBasicColors.getAllData();
	if (typeof data !== 'object')
		logger(`Expected an object but found ${data}`);
	else {
		const values = QBasicColors.getValuesForScreen(12);
		if (!(values instanceof Array))
			logger(`Expected getValuesForScreen(12) to return an Array but found ${values}`);
		else {
			// These palette sizes are based on a chart at:
			// https://qb64.com/wiki/SCREEN.html
			const screenToPaletteLengthCases = [
				[1, 4],
				[2, 2],
				[7, 16],
				[9, 16],
				[12, 16],
				// [13, 256] to be added eventually.
			];
			screenToPaletteLengthCases.forEach(function(caseInfo, index) {
				const screenNumber = caseInfo[0];
				const plogger = prefixWrapper(`Case ${index}, Screen ${screenNumber}`, logger);
				const values = QBasicColors.getValuesForScreen(screenNumber);
				const expectedLength = caseInfo[1];
				assertEquals(expectedLength, values.length, plogger);
			});
		}
	}
};