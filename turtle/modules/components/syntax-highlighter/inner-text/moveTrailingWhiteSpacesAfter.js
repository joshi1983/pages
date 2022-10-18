import { insertTextAfter } from './insertTextAfter.js';
import { moveTrailingLineBreaksAfter } from './moveTrailingLineBreaksAfter.js';

export function moveTrailingWhiteSpacesAfter(element) {
	while (element.lastChild !== null) {
		const lastChild = element.lastChild;
		if (lastChild.tagName === 'BR' || (typeof lastChild.nodeValue === 'string' && lastChild.nodeValue.endsWith('\n')))
			moveTrailingLineBreaksAfter(element);
		else if (lastChild.nodeType === lastChild.TEXT_NODE) {
			if (lastChild.nodeValue.trim() === '') {
				insertTextAfter(element, lastChild.nodeValue);
				element.removeChild(lastChild);
			}
			else if (lastChild.nodeValue.trimEnd() !== lastChild.nodeValue) {
				const index = lastChild.nodeValue.trimEnd().length;
				insertTextAfter(element, lastChild.nodeValue.substring(index));
				lastChild.nodeValue = lastChild.nodeValue.substring(0, index);
			}
			else
				return;
		}
		else
			return;
	}
};