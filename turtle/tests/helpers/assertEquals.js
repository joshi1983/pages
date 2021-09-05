import { appendChildren } from './appendChildren.js';
import { escapeHTML } from './escapeHTML.js';
import { getSpansForStringComparison } from './getSpansForStringComparison.js';
import { getStringComparisonDetails } from './getStringComparisonDetails.js';

function strong(s) {
	const strongElement = document.createElement('strong');
	if (typeof s === 'string')
		strongElement.innerText = s;
	else
		strongElement.appendChild(s);
	return strongElement;
}

export function assertEquals(expected, actual_, logger) {
	if (expected === actual_)
		return;
	if (typeof expected === 'string' && typeof actual_ === 'string') {
		const div = document.createElement('div');
		div.appendChild(strong('Expected:'));
		const out = document.createElement('div');
		out.classList.add('test-in-out-pairs-out');
		appendChildren(out, getSpansForStringComparison(expected, actual_));
		div.appendChild(out);
		const butGot = strong('but got ');
		div.appendChild(butGot);
		const actual = document.createElement('div');
		actual.classList.add('test-in-out-pairs-but-got');
		appendChildren(actual, getSpansForStringComparison(actual_, expected));
		div.appendChild(actual);
		const details = document.createElement('div');
		details.classList.add('test-in-out-pairs-details');
		details.appendChild(document.createTextNode(getStringComparisonDetails(expected, actual_)));
		div.appendChild(strong('. Details: '));
		div.appendChild(details);
		logger(div);
	}
	else
		logger(escapeHTML(`Expected "${expected}" but got "${actual_}"`));
};