import { getInnerText } from './getInnerText.js';
import { processPossibleToken } from './processPossibleToken.js';

export function insertText(lineGroup, index, newText, procNameSet) {
	if (!(lineGroup instanceof Node))
		throw new Error('lineGroup must be a Node or Element.  Not: ' + lineGroup);
	if (!Number.isInteger(index))
		throw new Error('index must be an integer.  Not: ' + index);
	if (!(procNameSet instanceof Set))
		throw new Error(`procNameSet must be a Set.  Not: ${procNameSet}`);

	
	if (lineGroup.nodeType === lineGroup.TEXT_NODE) {
		const s = lineGroup.nodeValue;
		lineGroup.nodeValue = s.substring(0, index) + newText + s.substring(index);
		processPossibleToken(lineGroup, procNameSet);
	}
	else if (lineGroup instanceof Element) {
		let innerTextLength = 0;
		for (let n = lineGroup.firstChild; n !== null ; n = n.nextSibling) {
			const singleInnerTextLength = getInnerText(n).length;
			const offsetIndex = index - innerTextLength;
			if (singleInnerTextLength >= offsetIndex) {
				insertText(n, offsetIndex, newText, procNameSet);
				return;
			}
			innerTextLength += singleInnerTextLength;
		}
		// create new text node to represent the new text.
		const textNode = document.createTextNode(newText);
		lineGroup.appendChild(textNode);
		processPossibleToken(textNode, procNameSet);
	}
};