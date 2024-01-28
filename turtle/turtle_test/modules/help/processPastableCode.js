import { ClipboardHelper } from '../ClipboardHelper.js';
import { CodeEditor } from '../components/CodeEditor.js';
import { Dialog } from '../components/Dialog.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { highlightLogoSyntaxInCodeElement } from '../components/syntax-highlighter/highlightLogoSyntaxInCodeElement.js';
import { ToastMessages } from '../components/ToastMessages.js';

function pasteToEditorClicked(event) {
	const target = event.target;
	const codeElement = target.closest('code');
	if (codeElement !== null) {
		Dialog.hide();
		const s = codeElement.textContent;
		CodeEditor.setSourceCode(s);
		if (!CodeEditor.isVisible)
			CodeEditor.show();
	}
}

function pasteToCommanderClicked(event) {
	const target = event.target;
	const codeElement = target.closest('code');
	if (codeElement !== null) {
		Dialog.hide();
		const s = codeElement.textContent;
		if (CodeEditor.isVisible)
			CodeEditor.restore(); // make sure commander is visible.

		PastableCodeDispatcher._dispatchEvent('codeSnippetSelected', {'s': s});
	}
}

function pasteToClipboardClicked(event) {
	const target = event.target;
	const codeElement = target.closest('code');
	if (codeElement !== null) {
		const s = codeElement.textContent;
		ClipboardHelper.copyStringToClipboard(s);
		ToastMessages.success('Copied to clipboard', false);
	}
}

function processPastableCodeElement(codeElement, clickHandler, title, iconClassName) {
	if (iconClassName === undefined)
		iconClassName = 'fa-file-import';
	const pasteClassName = 'paste-button';
	let pasteButton = codeElement.querySelector('.' + pasteClassName);
	if (pasteButton === null) {
		pasteButton = document.createElement('div');
		pasteButton.classList.add(pasteClassName, 'fa', iconClassName);
		pasteButton.setAttribute('title', title);
		pasteButton.addEventListener('click', clickHandler);
		codeElement.appendChild(pasteButton);
	}
}

export function processPastableCode(e, syntaxHighlightCodeElements) {
	if (typeof e.querySelectorAll !== 'function')
		throw new Error('e must be an Element or Document');
	if (syntaxHighlightCodeElements === undefined)
		syntaxHighlightCodeElements = false;

	const codeElements = e.querySelectorAll('code.pastable');
	codeElements.forEach(function(codeElement) {
		processPastableCodeElement(codeElement, pasteToEditorClicked, 'Replace code in code editor with this example and close tutorial');
	});
	if (syntaxHighlightCodeElements) {
		e.querySelectorAll('code').forEach(codeElement => highlightLogoSyntaxInCodeElement(codeElement));
	}
	const singleLineCommandElements = e.querySelectorAll('code.commander-pastable');
	singleLineCommandElements.forEach(function(codeElement) {
		processPastableCodeElement(codeElement, pasteToCommanderClicked, 'Copy this to Commander');
	});
	const clipboardElements = e.querySelectorAll('code.clipboard-pastable');
	clipboardElements.forEach(function(codeElement) {
		processPastableCodeElement(codeElement, pasteToClipboardClicked, 'Copy this to clipboard', 'fa-clipboard');
	});
};

const PastableCodeDispatcher = new EventDispatcher(['codeSnippetSelected']);
export { PastableCodeDispatcher };