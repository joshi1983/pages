import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { pullInNeighbouringNonWhitespaces } from '../../../../modules/components/syntax-highlighter/inner-text/pullInNeighbouringNonWhitespaces.js';

export function testPullInNeighbouringNonWhitespaces(logger) {
	const cases = [
		{
			'inHTML': '<span class="number-literal">12</span>+<span class="number-literal">4</span>',
			'childIndex': 0,
			'outHTML': '<span class="number-literal">12+</span><span class="number-literal">4</span>'
		},
		{
			'inHTML': '<span class="number-literal">12</span>+<span class="number-literal">4</span>',
			'childIndex': 1,
			'outHTML': '12+4'
		},
		{
			'inHTML': '<span class="number-literal">12</span>+<span class="number-literal">4</span>',
			'childIndex': 2,
			'outHTML': '<span class="number-literal">12+4</span>'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const container = document.createElement('pre');
		const lineGroup = document.createElement('span');
		container.appendChild(lineGroup);
		lineGroup.innerHTML = caseInfo.inHTML;
		const node = lineGroup.childNodes[caseInfo.childIndex];
		pullInNeighbouringNonWhitespaces(node);
		if (lineGroup.innerHTML !== caseInfo.outHTML)
			plogger(`Expected "${escapeHTML(caseInfo.outHTML)}" but got "${escapeHTML(lineGroup.innerHTML)}"`);
	});
};