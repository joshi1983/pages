import { Comments } from './logo-textarea/Comments.js';
import { EventDispatcher } from '../../EventDispatcher.js';
import { fetchText } from '../../fetchText.js';
import { highlightLogoSyntaxInTextarea } from '../syntax-highlighter/highlightLogoSyntaxInTextarea.js';
import { Keys } from '../Keys.js';
import { LineNumbers } from './logo-textarea/LineNumbers.js';
import { SelectionUtils } from '../SelectionUtils.js';
import { Tabs } from './logo-textarea/Tabs.js';
const html = await fetchText('content/components/code-editor/logo-textarea.html');

function getNewContainerElement() {
	let result = document.createElement('div');
	result.innerHTML = html;
	return result.querySelector(':scope > div');
}

export class LogoTextarea extends EventDispatcher {
	constructor(context) {
		super(['change', 'select']);
		this.rootDiv = getNewContainerElement();
		this.lineNumbers = new LineNumbers(this.rootDiv);
		this.txtarea = this.rootDiv.querySelector('textarea');
		highlightLogoSyntaxInTextarea(this.txtarea, context);
		this.previousValue = this.txtarea.value;
		const outer = this;
		this.txtarea.addEventListener('keydown', function(event) {
			if (!event.altKey && (!event.ctrlKey || Keys.isSemicolon(event))) {
				const start = this.selectionStart;
				const end = this.selectionEnd;
				const val = outer.txtarea.value;
				const selectedText = val.substring(start, end);
				let newVal = val.substring(0, start);
				let replaceVal = false;
				if (Keys.isSemicolon(event) && !event.shiftKey) {
					replaceVal = true;
					if (event.ctrlKey)
						newVal += Comments.removeCommentPrefixes(selectedText);
					else
						newVal += Comments.addCommentPrefixes(selectedText);
				}
				else if (Keys.isTabKey(event)) {
					replaceVal = true;
					if (event.shiftKey)
						newVal += Tabs.removeTabs(selectedText);
					else {
						newVal += Tabs.insertTabs(selectedText);
					}
				}
				if (replaceVal) {
					newVal += val.substring(end);
					outer.txtarea.value = newVal;

					if (selectedText.trim() === '') {
						outer.txtarea.selectionStart = start + 1;
						outer.txtarea.selectionEnd = start + 1;
					}
					else {
						outer.txtarea.selectionStart = start;
						outer.txtarea.selectionEnd = end + (newVal.length - val.length);
					}
					event.preventDefault();
					outer.dispatchChanged();
				}
			}
		});
		['change', 'cut', 'keyup', 'paste', 'propertychange'].forEach(function(eventKey) {
			outer.txtarea.addEventListener(eventKey, function() {
				setTimeout(function() {
					if (outer.previousValue !== outer.txtarea.value) {
						outer.dispatchChanged();
					}
				}, 0);
			});
		});
	}

	dispatchChanged() {
		this.previousValue = this.txtarea.value;
		this._dispatchEvent('change', {});
		this.lineNumbers.refreshLineCount();
	}

	getRootElement() {
		return this.rootDiv;
	}

	getSelectedText() {
		return SelectionUtils.getSelectedText(this.txtarea);
	}

	getValue() {
		return this.txtarea.value;
	}

	insertTextAtCursor(s) {
		if (typeof s !== 'string')
			throw new Error('insertTextAtCursor requires a string');

		// The following was adapted from an answer at:
		// https://stackoverflow.com/questions/11076975/how-to-insert-text-into-the-textarea-at-the-current-cursor-position

		//IE support
		if (document.selection) {
			this.txtarea.focus();
			const sel = document.selection.createRange();
			sel.text = s;
		}
		//MOZILLA and others
		else if (this.txtarea.selectionStart || this.txtarea.selectionStart == '0') {
			const startPos = this.txtarea.selectionStart;
			const endPos = this.txtarea.selectionEnd;
			this.setValue(this.txtarea.value.substring(0, startPos)
				+ s
				+ this.txtarea.value.substring(endPos, this.txtarea.value.length));
		} else {
			this.setValue(this.txtarea.value + s);
		}
	}

	setCursorPosition(colIndex, lineIndex) {
		let index = 0;
		let s = this.txtarea.value;
		let curLineIndex = 0;
		let curColIndex = 0;
		let i = 0;
		for (; i < s.length; i++) {
			curColIndex++;
			if (s.charAt(i) === '\n') {
				curLineIndex++;
				curColIndex = 0;
			}
			if (curLineIndex > lineIndex || (curLineIndex === lineIndex && curColIndex >= colIndex))
				break;
		}
		SelectionUtils.setSelectionRange(this.txtarea, i, i);
	}

	setParseMessages(messages) {
		this.lineNumbers.setMessages(messages);
	}

	setValue(s) {
		this.txtarea.value = s;
		this.txtarea.dispatchEvent(new Event("change"));
		if (s !== this.previousValue) {
			this.dispatchChanged();
			this.previousValue = s;
		}
	}

	useNormalTextSize() {
		this.rootDiv.classList.remove('small-text');
	}

	useSmallText() {
		this.rootDiv.classList.add('small-text');
	}
};