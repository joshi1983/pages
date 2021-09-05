import { MessageTypes } from '../../MessageTypes.js';

export function showParseMessagesAtLine(lineNumber) {
	lineNumber.div.className = '';
	lineNumber.div.classList.add('line-number');
	if (lineNumber.isExecutionPoint)
		lineNumber.div.classList.add('execution-point');
	const span = lineNumber.div.querySelector('span');
	if (span !== null)
		lineNumber.div.removeChild(span);
	if (lineNumber.messageTypeClassName !== undefined) {
		lineNumber.div.classList.add(lineNumber.messageTypeClassName);
		const newSpan = document.createElement('span');
		newSpan.classList.add(...MessageTypes.getIconClassNames(lineNumber.mostUrgentMessageType));
		lineNumber.div.appendChild(newSpan);
	}
};