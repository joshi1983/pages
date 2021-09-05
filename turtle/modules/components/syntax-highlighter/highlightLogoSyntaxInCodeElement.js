import { codeToElement } from './codeToElement.js';
var codeElementSyntaxHighlighterCount = 1;

/*
Used for syntax highlighing in code elements.
*/
export function highlightLogoSyntaxInCodeElement(codeElement) {
	if (!(codeElement instanceof Element))
		throw new Error('codeElement must be an Element');
	const preInfo = codeToElement(codeElement.textContent, undefined, undefined,
		'code-element-syntax-highlighter-' + (codeElementSyntaxHighlighterCount++), false);
	const pre = preInfo.element;
	// remove all the text nodes and elements other than div.
	const elementsToRemove = codeElement.querySelectorAll(':not(div)');
	elementsToRemove.forEach(e => e.remove());
	for (let n = codeElement.firstChild; n !== null; ) {
		if (n instanceof Text) {
			const next = n.nextSibling;
			n.remove();
			n = next;
		}
		else
			n = n.nextSibling;
	}

	codeElement.appendChild(pre);
};