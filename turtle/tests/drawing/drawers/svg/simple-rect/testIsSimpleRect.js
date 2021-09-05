import { getSimpleRectTestCases } from '../getSimpleRectTestCases.js';
import { isSimpleRect } from '../../../../../modules/drawing/drawers/svg/simple-rect/isSimpleRect.js';
import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';

export function testIsSimpleRect(logger) {
	const cases = getSimpleRectTestCases();
	testInOutPairs(cases.map(function(caseInfo) {
		return {'in': caseInfo.path, 'out': caseInfo.out};
	}), isSimpleRect, logger);
};