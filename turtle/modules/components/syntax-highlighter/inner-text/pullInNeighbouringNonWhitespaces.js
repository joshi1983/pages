import { getInnerText } from './getInnerText.js';
import { insertTextAfter } from './insertTextAfter.js';
import { insertTextAtEnd } from './insertTextAtEnd.js';
import { insertTextAtStart } from './insertTextAtStart.js';
import { insertTextBefore } from './insertTextBefore.js';
import { isSyntaxHighlighterContainer } from './isSyntaxHighlighterContainer.js';
import { setInnerText } from './setInnerText.js';
import { setInnerTextOrRemove } from './setInnerTextOrRemove.js';

function getNextNodeWithInnerText(node) {
	if (node === null || isSyntaxHighlighterContainer(node))
		return;
	for (let n = node.nextSibling; n !== null; n = n.nextSibling) {
		if (getInnerText(n) !== '')
			return n;
	}
	return getNextNodeWithInnerText(node.parentNode);
}

function getPreviousNodeWithInnerText(node) {
	if (node === null || isSyntaxHighlighterContainer(node))
		return;
	for (let n = node.previousSibling; n !== null; n = n.previousSibling) {
		if (getInnerText(n) !== '')
			return n;
	}
	return getPreviousNodeWithInnerText(node.parentNode);
}

function getNonWhiteSpaceEnding(s) {
	let result = '';
	for (let i = s.length - 1; i >= 0; i--) {
		const ch = s.charAt(i);
		if (ch.trim() === '')
			return result;
		result = ch + result;
	}
	return result;
}

function getNonWhiteSpaceStart(s) {
	let result = '';
	for (let i = 0; i < s.length; i++) {
		const ch = s.charAt(i);
		if (ch.trim() === '')
			return result;
		result += ch;
	}
	return result;
}

function needsToProcessMore(node) {
	const innerText = getInnerText(node);
	return '+-'.indexOf(innerText.charAt(0)) !== -1;
}

function processPrevious(node) {
	const previous = getPreviousNodeWithInnerText(node);
	const innerText = getInnerText(node);
	if (previous !== undefined && innerText.trimStart() === innerText) {
		const previousInnerText = getInnerText(previous);
		const s = getNonWhiteSpaceEnding(previousInnerText);
		insertTextAtStart(node, s);
		setInnerTextOrRemove(previous, previousInnerText.substring(s.length));
		return true; // indicate something changed.
	}
}

export function pullInNeighbouringNonWhitespaces(node) {
	const next = getNextNodeWithInnerText(node);
	const innerText = getInnerText(node);
	if (innerText === '')
		return; // nothing to do.
	if (next !== undefined) {
		if (innerText.trimEnd() === innerText) {
			const nextInnerText = getInnerText(next);
			const s = getNonWhiteSpaceStart(nextInnerText);
			insertTextAtEnd(node, s);
			setInnerTextOrRemove(next, nextInnerText.substring(s.length));
		}
	}
	if (processPrevious(node) === true && needsToProcessMore(node))
		processPrevious(node);
};