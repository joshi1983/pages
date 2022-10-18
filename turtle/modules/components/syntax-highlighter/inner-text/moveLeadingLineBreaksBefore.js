import { insertTextBefore } from './insertTextBefore.js';

export function moveLeadingLineBreaksBefore(element) {
	let somethingRemoved;
	do {
		const firstChild = element.firstChild;
		somethingRemoved = false;
		if (firstChild !== null) {
			if (firstChild.tagName === 'BR') {
				insertTextBefore(element, '\n');
				element.removeChild(firstChild);
				somethingRemoved = true;
			}
			else if (firstChild.nodeType === element.TEXT_NODE) {
				somethingRemoved = true;
				if (firstChild.nodeValue === '\n') {
					insertTextBefore(element, firstChild.nodeValue);
					element.removeChild(firstChild);
				}
				else if (firstChild.nodeValue.startsWith('\n')) {
					insertTextAfter(element, '\n');

					// remove first character.
					firstChild.nodeValue = firstChild.nodeValue.substring(1);
				}
				else
					somethingRemoved = false;
			}
		}
	}
	while (somethingRemoved);
};