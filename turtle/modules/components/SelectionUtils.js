import { StringUtils } from '../StringUtils.js';

export class SelectionUtils {
	// @param textarea could be an input or textarea element.
	static getCursorPosition(textarea) {
		let option = textarea.selectionStart;
		const s = textarea.value.substring(0, option);
		const lineIndex = StringUtils.countChar(s, '\n');
		let colIndex = s.length - s.lastIndexOf('\n') - 1;
		if (lineIndex === 0)
			colIndex = option;
		return {
			'lineIndex': lineIndex,
			'colIndex': colIndex
		};
	}

	static getSelectedText(input) {
		let selectedText = '';
		if (input.selectionStart !== undefined)
		{// Standards Compliant Version
			const startPos = input.selectionStart;
			const endPos = input.selectionEnd;
			selectedText = input.value.substring(startPos, endPos);
		}
		else if (document.selection !== undefined)
		{// IE Version
			input.focus();
			const sel = document.selection.createRange();
			selectedText = sel.text;
		}
		return selectedText;
	}

	static setSelectionRange(input, selectionStart, selectionEnd) {
		if (!(input instanceof Element))
			throw new Error('input must be an HTML Element');
		if (typeof selectionStart !== 'number')
			throw new Error('selectionStart must be a number');
		if (typeof selectionEnd !== 'number')
			throw new Error('selectionEnd must be a number');

		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	}
};