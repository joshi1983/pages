import { ArrayUtils } from '../../../../modules/ArrayUtils.js';
import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processColorStringLiterals } from '../../../../modules/components/syntax-highlighter/highlighters/processColorStringLiterals.js';

export function testProcessColorStringLiterals(logger) {
	const cases = [
		{
			'in': 'setPenColor <span class="string-literal" id="textarea-syntax-highlighter-1-8-15">"red</span>',
			'out': 'setPenColor <span class="string-literal color-literal dark" id="textarea-syntax-highlighter-1-8-15" style="background-image: linear-gradient(rgb(255, 0, 0), rgb(255, 0, 0), black);">"red</span>'
		},
		{
			'in': 'setPenColor <span class="string-literal" id="textarea-syntax-highlighter-1-8-15">"#1234</span>',
			'out': 'setPenColor <span class="string-literal color-literal dark" id="textarea-syntax-highlighter-1-8-15" style="background-image: linear-gradient(rgb(34, 51, 68), rgb(34, 51, 68), black);">"#1234</span>'
		}
	];
	// Some cases that should not be changed.
	const htmlWithoutColours = [
		'print <span class="string-literal" id="textarea-syntax-highlighter-1-8-15">"bblluuee</span>'
	];
	ArrayUtils.pushAll(cases, htmlWithoutColours.map((html) => {
		return {'in': html, 'out': html};
	}));

	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const container = document.createElement('pre');
		container.innerHTML = caseInfo.in;
		processColorStringLiterals(container);
		const resultHTML = container.innerHTML;
		if (resultHTML !== caseInfo.out)
			plogger(`Expected result does not match actual result.  Expected: "${escapeHTML(caseInfo.out)}" but got "${escapeHTML(resultHTML)}"`);
	});
};