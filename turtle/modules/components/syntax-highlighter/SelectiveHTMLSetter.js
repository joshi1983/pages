import { ArrayUtils } from '../../ArrayUtils.js';

export class SelectiveHTMLSetter {
	constructor(container) {
		this.container = container;
		this.pastLines = [];
		this.lineDivs = [];
	}

	processLine(htmlLines, i) {
		const line = htmlLines[i];
		if (this.pastLines[i] !== line) {
			let isCreated = false;
			if (this.lineDivs[i] === undefined) {
				this.lineDivs[i] = document.createElement('div');
				isCreated = true;
			}
			this.lineDivs[i].innerHTML = line;
			if (isCreated) {
				this.container.appendChild(this.lineDivs[i]);
			}
			this.pastLines[i] = htmlLines[i];
		}
	}

	removeFromBeginning(numToRemove) {
		for (let i = 0; i < numToRemove; i++) {
			this.lineDivs[i].remove();
		}
		this.pastLines.splice(0, numToRemove);
		this.lineDivs.splice(0, numToRemove);
	}

	removeFromMiddle(startIndex, numToRemove) {
		const lastIndexToRemove = startIndex + numToRemove - 1;
		for (let i = startIndex; i <= lastIndexToRemove; i++) {
			this.lineDivs[i].remove();
		}
		this.lineDivs.splice(startIndex, numToRemove);
		this.pastLines.splice(startIndex, numToRemove);
	}

	replaceLines(htmlLines) {
		let lastDifferentIndex;
		let firstDifferentIndex;
		let i = htmlLines.length - 1;
		for (lastDifferentIndex = this.pastLines.length - 1; lastDifferentIndex >= 0; lastDifferentIndex--) {
			if (this.pastLines[lastDifferentIndex] !== htmlLines[i])
				break;
			i--;
		}
		if (i < 0 && this.pastLines.length > htmlLines.length) {
			this.removeFromBeginning(this.pastLines.length - htmlLines.length);
			return;
		}
		const numEqualAtEnd = this.pastLines.length - lastDifferentIndex - 1;
		if (numEqualAtEnd === this.pastLines.length && this.pastLines.length === htmlLines.length)
			return; // nothing to do.  They're the same.
		const maxFirstIndex = Math.min(this.pastLines.length, htmlLines.length - numEqualAtEnd);
		for (firstDifferentIndex = 0; firstDifferentIndex < maxFirstIndex; firstDifferentIndex++) {
			if (this.pastLines[firstDifferentIndex] !== htmlLines[firstDifferentIndex])
				break;
		}
		if (htmlLines.length < this.pastLines.length) {
			if (htmlLines.length < this.pastLines.length && lastDifferentIndex + 1 - firstDifferentIndex === this.pastLines.length - htmlLines.length) {
				this.removeFromMiddle(firstDifferentIndex, this.pastLines.length - htmlLines.length);
				return;
			}
		}
		const lastIndexToProcess = Math.min(lastDifferentIndex, htmlLines.length - 1);
		for (let i = firstDifferentIndex; i <= lastIndexToProcess; i++) {
			this.processLine(htmlLines, i);
		}
		if (this.pastLines.length > htmlLines.length) {
			const numToRemove = this.pastLines.length - htmlLines.length;
			const endIndex = Math.min(this.lineDivs.length, lastDifferentIndex + numToRemove);
			const startIndex = Math.min(Math.max(0, lastDifferentIndex), htmlLines.length);
			for (let i = startIndex; i < endIndex; i++) {
				this.lineDivs[i].remove();
			}
			this.lineDivs.splice(startIndex, numToRemove);
			this.pastLines.splice(startIndex, numToRemove);
		}
		else if (this.pastLines.length < htmlLines.length) {
			const len = lastDifferentIndex + 1 + htmlLines.length - this.pastLines.length;
			const nextNode = this.lineDivs[lastDifferentIndex + 1];
			const toBeInsertedDivs = [];
			const toBeInsertedLines = [];
			for (let i = lastDifferentIndex + 1; i < len; i++) {
				const newDiv = document.createElement('div');
				newDiv.innerHTML = htmlLines[i];
				if (nextNode === undefined)
					this.container.appendChild(newDiv);
				else
					this.container.insertBefore(newDiv, nextNode);
				toBeInsertedDivs.push(newDiv);
				toBeInsertedLines.push(htmlLines[i]);
			}
			ArrayUtils.insertArray(this.lineDivs, lastDifferentIndex + 1, toBeInsertedDivs);
			ArrayUtils.insertArray(this.pastLines, lastDifferentIndex + 1, toBeInsertedLines);
		}
	}

	setHTMLLines(htmlLines) {
		for (let i = 0; i < htmlLines.length; i++) {
			const line = htmlLines[i];
			if (line === '') {
				htmlLines[i] = ' ';
			}
		}
		this.replaceLines(htmlLines);
	}
};