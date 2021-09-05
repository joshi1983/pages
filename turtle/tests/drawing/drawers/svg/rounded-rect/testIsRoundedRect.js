import { getRoundedRectTestCases } from './getRoundedRectTestCases.js';
import { isRoundedRect } from '../../../../../modules/drawing/drawers/svg/rounded-rect/isRoundedRect.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testIsRoundedRect(logger) {
	const cases = getRoundedRectTestCases(logger);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = isRoundedRect(caseInfo.path);
		if (result !== caseInfo.out) {
			plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
};