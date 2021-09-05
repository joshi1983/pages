import { MessageCount } from
'../../../../modules/components/code-editor/quality-report/MessageCount.js';

export function testMessageCount(logger) {
	const countDiv = document.createElement('div');
	const container = document.createElement('div');
	container.setAttribute('id', 'quality-report-message-count');
	document.body.appendChild(container);
	const count = new MessageCount(countDiv);
	for (let i = 0; i < 3; i++) {
		count.setCount(i);
	}
	count.increment();
	container.remove();
};