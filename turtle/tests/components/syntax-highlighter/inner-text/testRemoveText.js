import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { removeInnerText } from '../../../../modules/components/syntax-highlighter/inner-text/removeInnerText.js';
import { simplifyHTML } from '../simplifyHTML.js';

export function testRemoveText(lineGroup, startIndex, len, expectedOutHTML, logger) {
	if (!(lineGroup instanceof Element))
		throw new Error('lineGroup must be an Element.  Not: ' + lineGroup);
	if (lineGroup.tagName !== 'SPAN')
		throw new Error('lineGroup.tagName must be SPAN.  Not: ' + lineGroup.tagName);
	if (!lineGroup.hasAttribute('id'))
		throw new Error('Expected lineGroup to have an id attribute');
	if (lineGroup.getAttribute('id').indexOf('-highlighter-lines-from-') === -1)
		throw new Error(`Expected id to contain "-highlighter-lines-from-" but got "${lineGroup.getAttribute('id')}"`);
	const procNameSet = new Set();
	const result = removeInnerText(lineGroup, startIndex, len, procNameSet);
	const outHTML = lineGroup.innerHTML;
	if (simplifyHTML(outHTML) !== simplifyHTML(expectedOutHTML))
		logger(`Expected HTML "${escapeHTML(simplifyHTML(expectedOutHTML))}" but got "${escapeHTML(simplifyHTML(outHTML))}"`);
	if (result !== len)
		logger(`Expected result to be ${len} but got ${result}`);
};