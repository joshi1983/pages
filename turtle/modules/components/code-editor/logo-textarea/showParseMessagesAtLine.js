import { MessageTypes } from '../../MessageTypes.js';

export function showParseMessagesAtLine(lineNumber) {
	const div = lineNumber.div;
	div.className = '';
	div.classList.add('line-number');
	if (lineNumber.isExecutionPoint)
		div.classList.add('execution-point');
	else if (lineNumber.isExecutionBranchingPoint)
		div.classList.add('execution-branching-point');
	const span = lineNumber.div.querySelector('span');
	if (span !== null)
		div.removeChild(span);
	if (lineNumber.messageTypeClassName !== undefined) {
		div.classList.add(lineNumber.messageTypeClassName);
		const newSpan = document.createElement('span');
		newSpan.classList.add(...MessageTypes.getIconClassNames(lineNumber.mostUrgentMessageType));
		div.appendChild(newSpan);
	}
};