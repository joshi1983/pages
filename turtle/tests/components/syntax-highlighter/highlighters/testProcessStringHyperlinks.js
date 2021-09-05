import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processStringHyperlinks } from '../../../../modules/components/syntax-highlighter/highlighters/processStringHyperlinks.js';

export function testProcessStringHyperlinks(logger) {
	const cases = [
		{
			'in': 'print <span class="string-literal" id="textarea-syntax-highlighter-1-8-15">\'https://www.google.com\'</span>',
			'out': 'print <span class="string-literal" id="textarea-syntax-highlighter-1-8-15">\'<a href="https://www.google.com" target="_blank">https://www.google.com</a>\'</span>',
		}
	];

	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const container = document.createElement('pre');
		container.innerHTML = caseInfo.in;
		processStringHyperlinks(container);
		const resultHTML = container.innerHTML;
		if (resultHTML !== caseInfo.out)
			plogger(`Expected result does not match actual result.  Expected: "${escapeHTML(caseInfo.out)}" but got "${escapeHTML(resultHTML)}"`);
	});
};