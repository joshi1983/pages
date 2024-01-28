import { EventDispatcher } from '../EventDispatcher.js';
import { Keys } from './Keys.js';
import { messageToDiv } from './messageToDiv.js';
import { MessageTypes } from './MessageTypes.js';
import { processHelpLinks } from '../help/processHelpLinks.js';
import { ToastMessages } from './ToastMessages.js';
const MaxLines = 100;

class CommandBoxMessage {
	constructor(s, type, isHTML) {
		if (typeof s !== 'string')
			throw new Error('s must be a string');
		if (typeof type !== 'number')
			throw new Error('type must be a number.  Not: ' + type);
		if (isHTML === undefined)
			isHTML = false;
		else if (typeof isHTML !== 'boolean')
			throw new Error('isHTML must be undefined, true, or false.  Not: ' + isHTML);

		this.s = s;
		this.type = type;
		this.isHTML = isHTML;
	}

	createDiv() {
		if (this.div === undefined) {
			this.div = messageToDiv(this.s, this.type, this.isHTML);
		}
		return this.div;
	}
}

class PrivateCommandBoxMessages extends EventDispatcher {
	constructor() {
		super(['codeSnippetSelected', 'isEmptyChanged']);
		this.lines = [];
		this.batched_lines = []; // lines waiting to be added in a batch.
		const id = 'command-box-messages';
		this.container = document.getElementById(id);
		if (this.container === null)
			throw new Error('Unable to find element with id: ' + id);
		this.listeners = [];
		this.clearCursoredEffect();
	}

	_addContentLimitMessage() {
		const isSpecialShown = this.lines.filter(l => l.type === MessageTypes.TypeSpecial).length !== 0;
		if (!isSpecialShown) {
			const cmd = new CommandBoxMessage(
				'Some older messages have been hidden because there are too many to display together.', 
				MessageTypes.TypeSpecial, false);
			this.lines.unshift(cmd);
			const div = cmd.createDiv();
			this.container.insertBefore(div, this.container.firstChild);
		}
	}

	_dispatchCodeSnippetSelected(codeSnippetString) {
		this._scrollToCursored();
		super._dispatchEvent('codeSnippetSelected', {
			's': codeSnippetString
		});
	}

	_processBatchedLines() {
		if (this.batched_lines.length !== 0) {
			const wasEmpty = this.lines.length === 0;
			const outer = this;
			if (this.lines.length + this.batched_lines.length > MaxLines) {
				this._addContentLimitMessage();
				const newStart = this.lines.length - MaxLines + this.batched_lines.length;
				this.lines = this.lines.filter(function(line, index) {
					if (index < newStart && line.type !== MessageTypes.TypeSpecial) {
						line.div.remove();
						return false;
					}
					return true;
				});
				if (this.batched_lines.length > MaxLines)
					this.batched_lines = this.batched_lines.slice(this.batched_lines.length - MaxLines);
			}
			this.batched_lines.forEach(function(line) {
				outer.lines.push(line);
				const div = line.createDiv();
				if (line.type === MessageTypes.TypeCodeSnippet) {
					div.addEventListener('click', function() {
						const codeSnippets = outer.getCodeSnippets();
						outer.removeCursoredClassName();
						outer.cursoredIndex = codeSnippets.indexOf(line);
						div.classList.add('cursored');
						outer._dispatchCodeSnippetSelected(line.s);
					});
				}
				outer.container.appendChild(div);
			});
			this.batched_lines = [];
			// scroll down to show the new message.
			this.container.scrollTop = this.container.scrollHeight;
			if (wasEmpty)
				this._dispatchEvent('isEmptyChanged');
		}
	}

	_pushMessage(s, type, isHTML) {
		this.batched_lines.push(new CommandBoxMessage(s, type, isHTML));
	}

	_scrollToCursored() {
		const e = this.container.querySelector('.code.cursored');
		if (e) {
			// if element is not currently visible, scroll just enough to show it.
			e.scrollIntoView(true);
		}
	}

	addCodeSnippet(snippet) {
		this._pushMessage(snippet, MessageTypes.TypeCodeSnippet, false);
	}

	clear() {
		if (this.lines.length !== 0) {
			this.lines = [];
			this.container.innerHTML = '';
			this._dispatchEvent('isEmptyChanged');
		}
	}

	clearCursoredEffect() {
		this.removeCursoredClassName();
		this.cursoredIndex = undefined;
	}

	clearErrorsTipsAndWarnings() {
		const newLines = this.lines.filter(function(line) {
			return line.type !== MessageTypes.TypeWarning && line.type !== MessageTypes.TypeError && line.type !== MessageTypes.TypeTip;
		});
		if (newLines.length === 0)
			this.clear();
		else {
			if (this.lines.length !== newLines.length) {
				// remove them from the document.
				this.lines.forEach(function(line) {
					if (newLines.indexOf(line) === -1)
						line.createDiv().remove();
				});
				this.lines = newLines;
			}
		}
	}

	cursorDown() {
		if (this.cursoredIndex === undefined)
			return;
		const codeSnippets = this.getCodeSnippets();
		this.removeCursoredClassName();
		if (this.cursoredIndex < codeSnippets.length - 1) {
			this.cursoredIndex++;
			const snippet = codeSnippets[this.cursoredIndex];
			snippet.div.classList.add('cursored');
			this._dispatchCodeSnippetSelected(snippet.s);
		}
		else
			this.clearCursoredEffect();
	}

	cursorUp() {
		const codeSnippets = this.getCodeSnippets();
		this.removeCursoredClassName();
		if (codeSnippets.length > 0) {
			if (this.cursoredIndex === undefined)
				this.cursoredIndex = codeSnippets.length - 1;
			else if (this.cursoredIndex > 0)
				this.cursoredIndex--;
			const snippet = codeSnippets[this.cursoredIndex];
			snippet.div.classList.add('cursored');
			this._dispatchCodeSnippetSelected(snippet.s);
		}
	}

	error(msg, isHTML) {
		ToastMessages.error(msg, isHTML);
		this._pushMessage(msg, MessageTypes.TypeError, isHTML);
	}

	getCodeSnippets() {
		return this.lines.filter(function(line) {
			return line.type === MessageTypes.TypeCodeSnippet;
		});
	}

	isEmpty() {
		return this.lines.length === 0;
	}

	print(msg) {
		this._pushMessage(msg, MessageTypes.TypePrinted, false);
	}

	removeCursoredClassName() {
		const e = this.container.querySelector('.code.cursored');
		if (e)
			e.classList.remove('cursored');
	}

	tip(msg, isHTML) {
		this._pushMessage(msg, MessageTypes.TypeTip, isHTML);
	}

	warn(msg, isHTML) {
		ToastMessages.warn(msg, isHTML);
		this._pushMessage(msg, MessageTypes.TypeWarning, isHTML);
	}
}

const CommandBoxMessages = new PrivateCommandBoxMessages();

setInterval(function() {
	CommandBoxMessages._processBatchedLines();
}, 200);

window.addEventListener('keydown', function(event) {
	// ignore messages from code editor.
	if (event.target.tagName.toLowerCase() !== 'textarea') {
		// if the command input is in focus or CommandBoxMessages.cursoredIndex is a number
		if (Keys.isUpArrow(event, true))
			CommandBoxMessages.cursorUp();
		else if (Keys.isDownArrow(event, true))
			CommandBoxMessages.cursorDown();
	}
});

export { CommandBoxMessages };