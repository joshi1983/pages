import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { scanInnerText } from '../../../../modules/components/syntax-highlighter/inner-text/scanInnerText.js';
import { textToSpanWithClass } from '../../../../modules/components/syntax-highlighter/inner-text/textToSpanWithClass.js';

function testEmptyParameterizedGroup(logger) {
	const procNameSet = new Set();
	const container = document.createElement('span');
	const pg = textToSpanWithClass('', 'parameterized-group');
	container.appendChild(pg);
	const nodes = scanInnerText(pg, procNameSet);
	const expectedHTML = '';
	if (container.innerHTML !== expectedHTML)
		logger(`Expected innerHTML to be "${escapeHTML(expectedHTML)}" but got "${escapeHTML(container.innerHTML)}"`);
}

function testWithComment(logger) {
	const procNameSet = new Set();
	const container = document.createElement('span');
	const comment = textToSpanWithClass(';', 'comment');
	container.appendChild(comment);
	const node = comment.firstChild;
	const nodes = scanInnerText(node, procNameSet);
	const actualInnerText = container.innerText;
	const expectedInnerText = ';';
	const expectedHTML = '<span class="comment">;</span>';
	if (actualInnerText !== expectedInnerText)
		logger(`Expected innerText to be "${expectedInnerText}" but got "${actualInnerText}"`);
	if (expectedHTML !== container.innerHTML)
		logger(`Expected innerHTML to be "${escapeHTML(expectedHTML)}" but got "${escapeHTML(container.innerHTML)}"`);
	if (!(nodes instanceof Array))
		logger(`Expected result to be an Array but got ${nodes}`);
	else if (nodes.length !== 1)
		logger(`Expected length of 1 but got ${nodes.length}`);
}

function testWithLineBreaks(logger) {
	const container = document.createElement('pre');
	const lineGroup = document.createElement('span');
	container.appendChild(lineGroup);
	const originalText = '\n\n';
	const procNameSet = new Set();
	lineGroup.innerHTML = originalText;
	const textNode = lineGroup.firstChild;
	const nodes = scanInnerText(textNode, procNameSet);
	if (lineGroup.innerText !== originalText)
		logger(`innerText expected to be "${originalText}" but got "${lineGroup.innerText}"`);
	if (lineGroup.innerHTML !== originalText)
		logger(`innerHTML expected to be "${originalText}" but got "${lineGroup.innerHTML}"`);
	if (!(nodes instanceof Array))
		logger(`Expected nodes to be an Array but got ${nodes}`);
	else if (nodes.length !== 2)
		logger(`Expected nodes.length to be 2 but got ${nodes.length}`);
	else {
		nodes.forEach(function(node, index) {
			const plogger = prefixWrapper(`Node index ${index}`, logger);
			if (node.nodeValue !== '\n')
				plogger(`Expected nodeValue to be "\n" but got "${node.nodeValue}"`);
		});
	}
	if (lineGroup.childNodes.length !== 2)
		logger(`Expected number of child nodes to be 2 but got ${lineGroup.childNodes.length}`);
	else {
		lineGroup.childNodes.forEach(function(childNode, index) {
			const plogger = prefixWrapper(`Child node ${index}`, logger);
			if (childNode instanceof Element)
				plogger(`Expected a text node but got an Element with tagName: ${childNode.tagName}`);
			else if (childNode.nodeValue !== '\n')
				plogger(`Expected text to be "\n" but got "${childNode.nodeValue}"`);
		});
	}
}

export function testScanInnerText(logger) {
	testEmptyParameterizedGroup(prefixWrapper('testEmptyParameterizedGroup', logger));
	testWithComment(prefixWrapper('testWithComment', logger));
	testWithLineBreaks(prefixWrapper('testWithLineBreaks', logger));
};