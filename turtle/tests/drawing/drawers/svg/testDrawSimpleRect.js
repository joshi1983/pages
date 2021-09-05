import { checkNumberAttributes } from './checkNumberAttributes.js';
import { checkSubstrings } from './checkSubstrings.js';
import { drawSimpleRect } from '../../../../modules/drawing/drawers/svg/drawSimpleRect.js';
import { equalWithinThreshold } from '../../../../modules/equalWithinThreshold.js';
import { getSimpleRectTestCases } from './getSimpleRectTestCases.js';
import { MockSVGVector2DDrawerForTagPusher } from '../../../helpers/drawing/drawers/MockSVGVector2DDrawerForTagPusher.js';
import { PathShape } from '../../../../modules/drawing/vector/shapes/PathShape.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { scrapeRotationAngleFrom } from './scrapeRotationAngleFrom.js';

export function testDrawSimpleRect(logger) {
	const cases = getSimpleRectTestCases().filter(info => info.out === true);
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, x=${caseInfo.x}, y=${caseInfo.y}`, logger);
		const path = caseInfo.path;
		const mockSVGDrawer = new MockSVGVector2DDrawerForTagPusher();
		drawSimpleRect(mockSVGDrawer, path);
		const svg = mockSVGDrawer.getSVG();
		const substrings = ['<rect', ' width="', ' height="'];
		if (caseInfo.x !== 0 && caseInfo.x !== undefined)
			substrings.push(' x="');
		if (caseInfo.y !== 0 && caseInfo.y !== undefined)
			substrings.push(' y="');
		checkSubstrings(substrings, svg, plogger);
		const rxIndex = svg.indexOf(' rx="');
		if (rxIndex !== -1)
			plogger(`Not expected to find rx attribute but found it at ${svg.substring(rxIndex)}`);
		if (caseInfo.rotation !== undefined) {
			const rotation = scrapeRotationAngleFrom(svg);
			if (!equalWithinThreshold(rotation, caseInfo.rotation, 0.00001)) {
				plogger(`Expected rotation of ${caseInfo.rotation} but got ${rotation}`);
			}
		}
		checkNumberAttributes(caseInfo, svg, plogger);
	});
};