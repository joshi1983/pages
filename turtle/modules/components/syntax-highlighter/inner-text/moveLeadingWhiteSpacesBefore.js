import { insertTextBefore } from './insertTextBefore.js';
import { moveLeadingLineBreaksBefore } from './moveLeadingLineBreaksBefore.js';

export function moveLeadingWhiteSpacesBefore(element) {
	while (element.firstChild !== null) {
		const firstChild = element.firstChild;
		if (firstChild.tagName === 'BR' || (typeof firstChild.nodeValue === 'string' && firstChild.nodeValue.startsWith('\n')))
			moveLeadingLineBreaksBefore(element);
		else if (firstChild.nodeType === firstChild.TEXT_NODE) {
			if (firstChild.nodeValue.trim() === '') {
				insertTextBefore(element, firstChild.nodeValue);
				element.removeChild(firstChild);
			}
			else if (firstChild.nodeValue.trimStart() !== firstChild.nodeValue) {
				const index = firstChild.nodeValue.trimStart().length;
				insertTextBefore(element, firstChild.nodeValue.substring(0, index));
				firstChild.nodeValue = firstChild.nodeValue.substring(index);
			}
			else
				return;
		}
		else
			return;
	}
};