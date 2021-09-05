import { getSimpleRectTestCases } from '../getSimpleRectTestCases.js';
import { isSimpleRect } from '../../../../../modules/drawing/drawers/svg/simple-rect/isSimpleRect.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testIsSimpleRect(logger) {
	const cases = getSimpleRectTestCases();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = isSimpleRect(caseInfo.path);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};