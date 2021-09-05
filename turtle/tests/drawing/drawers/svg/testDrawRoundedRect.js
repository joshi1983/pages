import { drawRoundedRect } from '../../../../modules/drawing/drawers/svg/drawRoundedRect.js';
import { getRoundedRectTestCases } from './getRoundedRectTestCases.js';
import { SVGVector2DDrawer } from '../../../../modules/drawing/drawers/SVGVector2DDrawer.js';

export function testDrawRoundedRect(logger) {
	const cases = getRoundedRectTestCases().filter(c => c.out === true);
	const svgDrawer = new SVGVector2DDrawer(100, 100);
	cases.forEach(function(caseInfo) {
		drawRoundedRect(svgDrawer, caseInfo.path);
	});
};