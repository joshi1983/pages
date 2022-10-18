import { insertTextAfter } from '../../../../modules/components/syntax-highlighter/inner-text/insertTextAfter.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function testWithNewLine(logger) {
	const container = document.createElement('pre');
	const element = document.createElement('span');
	element.innerText = 'print';
	container.appendChild(element);
	insertTextAfter(element, '\n');
	const expectedText = 'print\n';
	const expectedHTML = '<span>print</span>\n';
	if (container.innerText !== expectedText)
		logger(`Expected innerText to be "${expectedText}" but got "${container.innerText}"`);
	if (container.innerHTML !== expectedHTML)
		logger(`Expected innerHTML to be "${expectedHTML}" but got "${container.innerHTML}"`);
}

export function testInsertTextAfter(logger) {
	testWithNewLine(prefixWrapper('testWithNewLine', logger));
};