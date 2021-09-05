import { highlightLogoSyntaxInTextarea } from '../../../modules/components/syntax-highlighter/highlightLogoSyntaxInTextarea.js';

export function testHighlightLogoSyntaxInTextarea(logger) {
	const textarea = document.createElement('textarea');
	const div = document.createElement('div');
	div.appendChild(textarea);
	textarea.value = 'fd 100';
	highlightLogoSyntaxInTextarea(textarea);
};