import { insertTextAfter } from './insertTextAfter.js';

export function moveTrailingLineBreaksAfter(element) {
	let somethingRemoved;
	do {
		const lastChild = element.lastChild;
		somethingRemoved = false;
		if (lastChild !== null) {
			if (lastChild.tagName === 'BR') {
				insertTextAfter(element, '\n');
				element.removeChild(lastChild);
				somethingRemoved = true;
			}
			else if (lastChild.nodeType === element.TEXT_NODE) {
				somethingRemoved = true;
				if (lastChild.nodeValue === '\n') {
					insertTextAfter(element, lastChild.nodeValue);
					element.removeChild(lastChild);
				}
				else if (lastChild.nodeValue.endsWith('\n')) {
					insertTextAfter(element, '\n');

					// remove last character.
					lastChild.nodeValue = lastChild.nodeValue.substring(0, lastChild.nodeValue.length - 1);
				}
				else
					somethingRemoved = false;
			}
		}
	}
	while (somethingRemoved);
};