import { defaultNumLinesPerGroup, Highlighter } from './highlighters/Highlighter.js';
import { insertText } from './inner-text/insertText.js';
import { removeInnerText } from './inner-text/removeInnerText.js';
import { StringUtils } from '../../StringUtils.js';

/*
This moves code changes to the syntax-highlighted elements without parsing or analyzing quality.
This doesn't always highlight the changes correctly but it must be extremely fast.

This is used while the user types code changes quickly.  
These changes get replaced with the completely parsed and analyzed results when the user stops typing quickly.
*/

function getIndexOfFirstDifferentCharacter(s1, s2) {
	const len = Math.min(s1.length, s2.length);
	for (let i = 0; i <= len; i++) {
		if (s1[i] !== s2[i])
			return i;
	}
}

export function setInnerTextSyntaxHighlighted(code, container, procNameSet) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string.  Not: ${code}`);
	if (!(container instanceof Element))
		throw new Error(`container must be an instance of Element.  Not: ${container}`);
	if (!container.hasAttribute('id'))
		throw new Error('container must have id attribute');
	if (!(procNameSet instanceof Set))
		throw new Error('procNameSet must be a Set.  Not: ' + procNameSet);
	if (container.tagName !== 'PRE')
		throw new Error('container expected to be a PRE element but it is not.  tagName=' + container.tagName);
	let oldCode = container.innerText;
	if (oldCode === code)
		return; // no change so nothing to do.
	let startIndex = getIndexOfFirstDifferentCharacter(oldCode, code);
	const endingLength = StringUtils.getLengthOfEqualEnding(oldCode, code, startIndex);
	let lengthToRemove = oldCode.length - startIndex - endingLength;
	let numLinesAtStart = StringUtils.countChar(oldCode, '\n', 0, startIndex);
	let oldCodeNeedsRefresh = false;
	/*
	We want to minimize the number of times accessing innerText because it is very slow when there is a lot of code.
	*/
	function refreshOldCode() {
		if (oldCodeNeedsRefresh)
			oldCode = container.innerText;
		oldCodeNeedsRefresh = false;
	}
	if (lengthToRemove > 0) {
		if (Highlighter.removeLineGroups(container, numLinesAtStart, lengthToRemove)) {
			oldCode = container.innerText;
			if (code === oldCode)
				return;
			startIndex = getIndexOfFirstDifferentCharacter(oldCode, code);
			lengthToRemove = oldCode.length - startIndex - endingLength;
			numLinesAtStart = StringUtils.countChar(oldCode, '\n', 0, startIndex);
			oldCodeNeedsRefresh = true;
		}
		const lineGroupLineNumber = numLinesAtStart - (numLinesAtStart % defaultNumLinesPerGroup);
		const selector = `[id="${Highlighter.formatLineGroupID(container.id, lineGroupLineNumber)}"]`;
		const lineGroup = container.querySelector(selector);
		if (lineGroup !== null) {
			let lineGroupStartIndex = startIndex;
			if (lineGroupLineNumber !== 0) {
				refreshOldCode();
				lineGroupStartIndex -= 1 + StringUtils.indexOfNthOccurrance(oldCode, 0, '\n', lineGroupLineNumber - 1);
			}
			if (lengthToRemove > 0) {
				lengthToRemove -= removeInnerText(lineGroup, lineGroupStartIndex, lengthToRemove, procNameSet);
				oldCodeNeedsRefresh = true;
			}
		}
	}
	if (lengthToRemove < 0)
		throw new Error('lengthToRemove must be at least 0.  lengthToRemove = ' + lengthToRemove);
	if (lengthToRemove === 0) {
		refreshOldCode();
		if (oldCode !== code) {
			startIndex = getIndexOfFirstDifferentCharacter(oldCode, code);
			numLinesAtStart = StringUtils.countChar(oldCode, '\n', 0, startIndex);
			const insertedText = code.substring(startIndex, code.length - endingLength);
			const lineGroupLineNumber = numLinesAtStart - (numLinesAtStart % defaultNumLinesPerGroup);
			const selector = `[id="${Highlighter.formatLineGroupID(container.id, lineGroupLineNumber)}"]`;
			const lineGroup = container.querySelector(selector);
			if (lineGroup !== null) {
				let lineGroupStartIndex = startIndex;
				if (lineGroupLineNumber !== 0)
					lineGroupStartIndex -= 1 + StringUtils.indexOfNthOccurrance(oldCode, 0, '\n', lineGroupLineNumber - 1);

				insertText(lineGroup, lineGroupStartIndex, insertedText, procNameSet);
				oldCodeNeedsRefresh = true;
			}
		}
	}
	refreshOldCode();
	if (oldCode !== code) {
		console.log(`replacing innerText due to a mismatch near "${container.innerText.substring(startIndex, startIndex + 10)}" and "${code.substring(startIndex, startIndex + 10)}"`);
		//container.innerText = code;
		return true; // indicate the HTML formatting was lost.
	}
};