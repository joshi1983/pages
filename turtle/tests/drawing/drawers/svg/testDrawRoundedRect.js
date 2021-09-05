import { checkNumberAttributes } from './checkNumberAttributes.js';
import { checkSubstrings } from './checkSubstrings.js';
import { drawRoundedRect } from '../../../../modules/drawing/drawers/svg/drawRoundedRect.js';
import { getRoundedRectTestCases } from './rounded-rect/getRoundedRectTestCases.js';
import { MockSVGVector2DDrawerForTagPusher } from '../../../helpers/drawing/drawers/MockSVGVector2DDrawerForTagPusher.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function filterSubstrings(caseInfo, substrings) {
	return substrings.filter(function(substring) {
		if (substring === ' x="') {
			return caseInfo.x !== 0 && caseInfo.x !== undefined;
		}
		if (substring === ' y="') {
			return caseInfo.y !== 0 && caseInfo.y !== undefined;
		}
		return true;
	});
}

export function testDrawRoundedRect(logger) {
	const cases = getRoundedRectTestCases(logger).filter(c => c.out === true);
	const substrings = ['<rect ', ' x="', ' y="', ' rx="', ' height="', ' width="'];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tagPusher = new MockSVGVector2DDrawerForTagPusher();
		drawRoundedRect(tagPusher, caseInfo.path);
		const svg = tagPusher.getSVG();
		const substringsFiltered = filterSubstrings(caseInfo, substrings);
		checkSubstrings(substringsFiltered, svg, plogger);
		if (caseInfo.noTransform === true) {
			const key = 'transform="';
			const index = svg.indexOf(key);
			if (index !== -1)
				plogger(`Expected to not transform but found it at: ${svg.substring(index + key.length, 15)}`);
		}
		checkNumberAttributes(caseInfo, svg, plogger);
	});
};