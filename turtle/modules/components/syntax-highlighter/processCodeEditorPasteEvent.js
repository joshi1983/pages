import { EventQueue } from '../EventQueue.js';

export function processCodeEditorPasteEvent(e) {
	if (e.type !== 'paste')
		return;
	const clipboardData = e.clipboardData || window.clipboardData;
	// check if browser supports clipboardData.
	// Some older browsers don't support it and we don't want to
	// throw a JavaScript error for those cases.
	// A mildly annoying autofix prompt showing more often in those
	// older browsers would be better than a JavaScript error that could stop most of WebLogo from working.
	if (typeof clipboardData === 'object') {
		/*
		The following came from this:
		https://www.grepper.com/answers/418239/detect+paste+in+textarea
		*/
		const pastedData = clipboardData.getData('Text');
		e.pastedString = pastedData;
	}
	EventQueue.addEvent(e);
};