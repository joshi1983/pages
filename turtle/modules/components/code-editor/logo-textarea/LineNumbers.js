import { EventDispatcher } from '../../../EventDispatcher.js';
import { LineNumber } from './LineNumber.js';
import { scrollFullLeftWhenClickingLineNumberMargin } from './scrollFullLeftWhenClickingLineNumberMargin.js';

export class LineNumbers extends EventDispatcher {
	constructor(parentElement) {
		super(['line-number-click']);
		this.lineNumbersContainer = parentElement.querySelector('.code-line-numbers');
		this.textarea = parentElement.querySelector('textarea');
		this.executingLineIndex = -1; // none executing.
		this.lines = [];
		this.refreshLineCount();
		scrollFullLeftWhenClickingLineNumberMargin(this);
	}

	hasAnyBreakpoints() {
		return this.lines.some(line => line.hasBreakpoint);
	}

	refreshLineCount() {
		const lineCount = this.textarea.value.split('\n').length;
		const outer = this;
		if (lineCount > this.lines.length) {
			// add the new elements.
			for (let i = this.lines.length; i < lineCount; i++) {
				const lineNumber = new LineNumber(i);
				this.lines.push(lineNumber);
				const div = lineNumber.getDiv();
				this.lineNumbersContainer.appendChild(div);
				div.addEventListener('click', function() {
					outer._dispatchEvent('line-number-click', {'line': lineNumber});
				});
			}
		}
		else {
			// remove the unneeded elements.
			for (let i = this.lines.length - 1; i >= lineCount; i--) {
				this.lines[i].getDiv().remove();
				this.lines.pop();
			}
		}
	}

	setBreakpointLines(lineIndexSets) {
		if (!(lineIndexSets instanceof Set))
			throw new Error('lineIndexSets must be a Set');
		const maxVal = Math.max(...Array.from(lineIndexSets));
		if (maxVal >= this.lines.length)
			throw new Error(`lineIndexSets must be in range 0..${this.lines.length - 1} but lineIndexSets contains ${maxVal}`);
		for (let i = 0; i < this.lines.length; i++) {
			if (!lineIndexSets.has(i))
				this.lines[i].setHasBreakpoint(false);
		}
		for (let i of lineIndexSets) {
			this.lines[i].setHasBreakpoint(true);
		}
	}

	setExecutingLine(lineIndex) {
		if (typeof lineIndex !== 'number')
			throw new Error('lineIndex must be a number');
		let executingLineIndex = lineIndex;
		if (executingLineIndex < 0 || this.lines.length <= lineIndex)
			executingLineIndex = -1;
		if (executingLineIndex !== this.executingLineIndex) {
			this.executingLineIndex = executingLineIndex;
			for (let i = 0; i < this.lines.length; i++) {
				this.lines[i].setExecutionPoint(i === executingLineIndex);
			}
		}
	}

	setMessages(messages) {
		this.lines.forEach(l => l.clearMessages());
		const outer = this;
		messages.forEach(function(message) {
			const lineIndex = message.getZeroBaseLineIndex();
			if (lineIndex < outer.lines.length)
				outer.lines[lineIndex].addMessage(message);
		});
	}
};