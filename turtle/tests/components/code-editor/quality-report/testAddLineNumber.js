import { addLineNumber } from
'../../../../modules/components/code-editor/quality-report/addLineNumber.js';

export function testAddLineNumber(logger) {
	const div = document.createElement('div');
	const messageElement = document.createElement('div');
	messageElement.innerText = 'Test Message';
	div.appendChild(messageElement);
	addLineNumber(div, 15);
};