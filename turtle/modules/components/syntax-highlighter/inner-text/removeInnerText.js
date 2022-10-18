import { getInnerText } from './getInnerText.js';
import { processPossibleToken } from './processPossibleToken.js';
import { setInnerText } from './setInnerText.js';

export function removeInnerText(lineGroup, fromIndex, len, procNameSet) {
	if (len <= 0)
		return 0; // nothing to do.
	if (!(procNameSet instanceof Set))
		throw new Error(`procNameSet must be a Set.  Not: ${procNameSet}`);
	if (lineGroup.nodeType === lineGroup.TEXT_NODE) {
		const innerText = lineGroup.nodeValue;
		if (fromIndex === 0 && len >= innerText.length) {
			const parent = lineGroup.parentNode;
			if (parent !== null) {
				// completely remove node.
				parent.removeChild(lineGroup);
				processPossibleToken(parent, procNameSet);
				return innerText.length;
			}
		}
		const newString = innerText.substring(0, fromIndex) + innerText.substring(fromIndex + len);
		lineGroup.nodeValue = newString;
		processPossibleToken(lineGroup, procNameSet);
		return innerText.length - newString.length;
	}
	let remainingLen = len;
	let innerTextLength = 0; // accumulates length of inner text as we iterate through child nodes.
	for (let n = lineGroup.firstChild; n !== null;) {
		const singleInnerTextLength = getInnerText(n).length;
		const newFromIndex = fromIndex - innerTextLength;
		innerTextLength += singleInnerTextLength;
		const next = n.nextSibling;
		if (singleInnerTextLength > newFromIndex) {
			const lenRemoved = removeInnerText(n, newFromIndex, Math.min(singleInnerTextLength, remainingLen), procNameSet);
			remainingLen -= lenRemoved;
			innerTextLength -= lenRemoved;
			if (remainingLen === 0) {
				return len;
			}
		}
		n = next;
	}
	const innerText = getInnerText(lineGroup);
	setInnerText(lineGroup, innerText.substring(0, fromIndex) + innerText.substring(fromIndex + len));
	return len;
};