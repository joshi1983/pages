import { highlightLogoSyntaxInCodeElement } from '../../../modules/components/syntax-highlighter/highlightLogoSyntaxInCodeElement.js';

export function testHighlightLogoSyntaxInCodeElement(logger) {
	const codeElement = document.createElement('code');
	codeElement.innerText = 'fd 100';
	highlightLogoSyntaxInCodeElement(codeElement);
};