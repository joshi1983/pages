import { processColorStringLiterals } from './processColorStringLiterals.js';
import { processStringHyperlinks } from './processStringHyperlinks.js';
import { StringBuffer } from '../../../StringBuffer.js';
import { StringUtils } from '../../../StringUtils.js';

export const defaultNumLinesPerGroup = 10;

export class Highlighter {
	static addLinesToContainerHTML(highlighterID, containerHTML, numLinesPerGroup) {
		if (numLinesPerGroup === undefined)
			numLinesPerGroup = defaultNumLinesPerGroup;
		if (typeof highlighterID !== 'string')
			throw new Error(`highlighterID must be a string: A unique identifier for the container element. Not: ${highlighterID}`);
		if (numLinesPerGroup <= 0 || !Number.isInteger(numLinesPerGroup))
			throw new Error('numLinesPerGroup must be a positive integer number.  Not: ' + numLinesPerGroup);
		if (typeof containerHTML !== 'string')
			throw new Error('containerHTML must be a string. Not: ' + containerHTML);
		const innerHTML = containerHTML;
		const htmlLines = innerHTML.split('\n');
		const resultHTML = new StringBuffer();
		for (let i = 0; i < htmlLines.length; i+= numLinesPerGroup) {
			const limit = Math.min(numLinesPerGroup, htmlLines.length - i);
			if (i !== 0)
				resultHTML.append('\n');
			resultHTML.append(`<span id="${Highlighter.formatLineGroupID(highlighterID, i)}">`);
			for (let j = 0; j < limit; j++) {
				if (j > 0)
					resultHTML.append('\n');
				resultHTML.append(htmlLines[i + j]);
			}
			resultHTML.append('</span>');
		}
		return resultHTML.toString();
	}

	static formatLineGroupID(containerID, fromLineNumber) {
		if (typeof containerID !== 'string')
			throw new Error('containerID must be a string.  Not: ' + containerID);
		return `${containerID}-highlighter-lines-from-${fromLineNumber}`;
	}

	static getLineGroupIDSelector(containerID) {
		return `:scope > span[id*="${containerID}-highlighter-lines-from-"]`;
	}

	static getLineNumberFromLineGroupID(lineGroupID) {
		const index = lineGroupID.lastIndexOf('-');
		return parseInt(lineGroupID.substring(index + 1));
	}

	// removeLineGroups also removes the innerText corresponding with the line groups.
	static removeLineGroups(container, startLineIndex, innerTextLengthToRemove, linesPerGroup) {
		if (linesPerGroup === undefined)
			linesPerGroup = defaultNumLinesPerGroup;
		if (!Number.isInteger(startLineIndex))
			throw new Error('startLineIndex must be an integer or undefined.  not: ' + startLineIndex);
		if (!Number.isInteger(innerTextLengthToRemove))
			throw new Error('innerTextLengthToRemove must be an integer or undefined.  not: ' + innerTextLengthToRemove);
		if (!Number.isInteger(linesPerGroup))
			throw new Error('linesPerGroup must be an integer or undefined.  not: ' + linesPerGroup);
		const containerID = container.id;
		let fromLineNumber = startLineIndex;
		let numRemoved = 0;
		if (fromLineNumber % linesPerGroup !== 0) {
			const newFromLineNumber = fromLineNumber + (linesPerGroup - fromLineNumber % linesPerGroup);
			const innerText = container.innerText;
			const charIndex1 = StringUtils.indexOfNthOccurrance(innerText, 0, '\n', fromLineNumber);
			const charIndex2 = StringUtils.indexOfNthOccurrance(innerText, charIndex1, '\n', newFromLineNumber - fromLineNumber);
			const lengthToRemove = charIndex2 - charIndex1;
			fromLineNumber = newFromLineNumber;
			innerTextLengthToRemove -= lengthToRemove;
		}
		if (innerTextLengthToRemove <= 0)
			return false; // nothing is being removed.
		while (true) {
			const lineGroup = container.querySelector(`:scope > [id="${Highlighter.formatLineGroupID(containerID, fromLineNumber)}"]`);
			if (lineGroup === null)
				break;
			if (lineGroup.innerText.length > innerTextLengthToRemove)
				break;
			innerTextLengthToRemove -= lineGroup.innerText.length;
			container.removeChild(lineGroup);
			numRemoved++;
			fromLineNumber += linesPerGroup;
		}
		if (numRemoved > 0) {
			// make sure any remaining line groups have the correct id values corresponding with their lines of code.
			Highlighter.undoAddLinesToContainer(container);
			container.innerHTML = Highlighter.addLinesToContainerHTML(container.id, container.innerHTML, linesPerGroup);
		}
		return numRemoved !== 0; // indicate if anything was removed.
	}

	static undoAddLinesToContainer(container) {
		const selector = Highlighter.getLineGroupIDSelector(container.id);
		const lineGroups = container.querySelectorAll(selector);
		const newHTML = new StringBuffer();
		lineGroups.forEach(function(lineGroup) {
			newHTML.append(lineGroup.innerHTML);
			lineGroup.remove();
		});
		container.innerHTML = newHTML.toString();
	}

	static process(container) {
		processColorStringLiterals(container);
		processStringHyperlinks(container);
	}
};