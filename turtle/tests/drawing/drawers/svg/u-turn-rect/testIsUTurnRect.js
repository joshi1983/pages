import { getUTurnTestCases } from './getUTurnTestCases.js';
import { isUTurnRect } from '../../../../../modules/drawing/drawers/svg/u-turn-rect/isUTurnRect.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { processRectangleCaseInfo } from '../processRectangleCaseInfo.js';

export function testIsUTurnRect(logger) {
	const cases = getUTurnTestCases();
	cases.forEach(processRectangleCaseInfo(logger));
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = isUTurnRect(caseInfo.path);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
};