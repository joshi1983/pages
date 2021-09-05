import { drawUTurnRect } from '../../../../modules/drawing/drawers/svg/drawUTurnRect.js';
import { getUTurnTestCases } from './u-turn-rect/getUTurnTestCases.js';
import { isUTurnRect } from '../../../../modules/drawing/drawers/svg/u-turn-rect/isUTurnRect.js';
import { MockSVGVector2DDrawerForTagPusher } from '../../../helpers/drawing/drawers/MockSVGVector2DDrawerForTagPusher.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processRectangleCaseInfo } from './processRectangleCaseInfo.js';

export function testDrawUTurnRect(logger) {
	const cases = getUTurnTestCases();
	cases.forEach(processRectangleCaseInfo(logger));
	cases.filter(caseInfo => isUTurnRect(caseInfo.path)).forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tagPusher = new MockSVGVector2DDrawerForTagPusher();
		drawUTurnRect(tagPusher, caseInfo.path);
	});
};