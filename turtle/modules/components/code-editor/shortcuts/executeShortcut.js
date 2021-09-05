import { CodeEditor } from '../../CodeEditor.js';
import { CommandBoxMessages } from '../../CommandBoxMessages.js';
import { SelectionUtils } from '../../SelectionUtils.js';
import { ToastMessages } from '../../ToastMessages.js';

export function executeShortcut(codeChangeShortcut, textarea) {
	if (typeof codeChangeShortcut !== 'function')
		throw new Error(`Expected codeChangeShortcut to be a function but found ${codeChangeShortcut}`);
	if (!(textarea instanceof Element))
		throw new Error(`textarea must be an Element but found ${textarea}`);

	const code = textarea.value;
	const cursorPosition = SelectionUtils.getCursorPosition(textarea);
	if (Number.isInteger(cursorPosition.lineIndex) &&
	Number.isInteger(cursorPosition.colIndex)) {
		let isReported = false;

		function reportError(msg) {
			CommandBoxMessages.error(msg, true);
			isReported = true;
		}

		function reportSuccess(msg) {
			ToastMessages.success(msg, true);
		}

		const newCode = codeChangeShortcut(code, cursorPosition, reportError, reportSuccess);
		if (isReported === false) {
			CodeEditor.setSourceCode(newCode);
		}
	}
};