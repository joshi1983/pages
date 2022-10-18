import { getInnerText } from './getInnerText.js';
import { isSyntaxHighlighterContainer } from './isSyntaxHighlighterContainer.js';
import { moveInnerTextWhileRemovingElement } from './moveInnerTextWhileRemovingElement.js';

function getInnerTextFirstCharAfter(node) {
	if (node === null || isSyntaxHighlighterContainer(node))
		return;
	for (let n = node.nextSibling; n !== null; n = n.nextSibling) {
		const innerText = getInnerText(n);
		if (innerText !== '')
			return innerText.charAt(0);
	}
	return getInnerTextFirstCharAfter(node.parentNode);
}

function getInnerTextLastCharBefore(node) {
	if (node === null || isSyntaxHighlighterContainer(node))
		return;
	for (let n = node.previousSibling; n !== null; n = n.previousSibling) {
		const innerText = getInnerText(n);
		if (innerText !== '')
			return innerText.charAt(innerText.length - 1);
	}
	return getInnerTextLastCharBefore(node.parentNode);
}

export function checkValidNeighbours(node, isValidCharacter) {
	if (!(node instanceof Node))
		throw new Error('node must be a Node or Element. Not: ' + node);
	if (typeof isValidCharacter !== 'function')
		throw new Error('isValidCharacter must be a function.  Not: ' + isValidCharacter);
	const lastCharBefore = getInnerTextLastCharBefore(node);
	const firstCharAfter = getInnerTextFirstCharAfter(node);
	if ((lastCharBefore !== undefined && !isValidCharacter(lastCharBefore))||
	(firstCharAfter !== undefined && !isValidCharacter(firstCharAfter))) {
		moveInnerTextWhileRemovingElement(node);
	}
};