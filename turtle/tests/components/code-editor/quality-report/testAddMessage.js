import { addMessage } from
'../../../../modules/components/code-editor/quality-report/addMessage.js';
import { MessageCount } from
'../../../../modules/components/code-editor/quality-report/MessageCount.js';
import { MessageTypes } from
'../../../../modules/components/MessageTypes.js';

// a mock for:
// ../../../../modules/components/messageToDiv.js
// the real module uses some dependencies that make it
// more troublesome to unit test with.
function messageToDiv(msg) {
	const div = document.createElement('div');
	div.innerHTML = msg.msg;
	return div;
}

export function testAddMessage(logger) {
	const countDiv = document.createElement('div');
	const messagesDiv = document.createElement('div');
	const messageCount = new MessageCount(countDiv);
	const addMessageFunc = addMessage(messagesDiv, messageCount, messageToDiv);
	if (typeof addMessageFunc !== 'function')
		logger(`addMessage should return a function but got ${typeof addMessageFunc}`);
	else {
		addMessageFunc({'msg': 'test message'});
	}
	addMessageFunc({'msg': 'test <strong>message</strong> with button'}, MessageTypes.TypeError, true, {
		'name': 'My Button',
		'onclick': function() {}
	});
};