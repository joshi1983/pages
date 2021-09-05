import { Dialog } from '../../Dialog.js';
import { fetchText } from '../../../fetchText.js';
import { MessageTypes } from '../../MessageTypes.js';
import { processHelpLinks } from '../../../help/processHelpLinks.js';
const html = await fetchText('content/components/code-editor/parse-message-viewer.html');

function messageToDiv(message) {
	const result = document.createElement('div');
	result.classList.add(MessageTypes.getClassName(message.type));
	const textElement = document.createElement('div');
	if (message.isHTML) {
		textElement.innerHTML = message.msg;
		processHelpLinks(textElement);
	}
	else
		textElement.innerText = message.msg;
	textElement.classList.add('text');
	const iconSpan = document.createElement('span');
	iconSpan.classList.add('fa', MessageTypes.getIconClassName(message.type));
	result.appendChild(iconSpan);
	result.appendChild(textElement);
	return result;
}

function compareMessagesByUrgency(m1, m2) {
	return MessageTypes.compareUrgency(m1.type, m2.type);
}

class PrivateParseMessageViewer {
	show(messages, lineNumber) {
		Dialog.show(html, 'Messages for Line ' + lineNumber, 400, 200, {
			'showOkButton': true
		});
		const container = document.getElementById('parse-message-container');
		const messagesClone = messages.slice(0); // clone to avoid mutating the caller's array.
		messagesClone.sort(compareMessagesByUrgency);
		messagesClone.forEach(function(message) {
			container.appendChild(messageToDiv(message));
		});
	}
};

const ParseMessageViewer = new PrivateParseMessageViewer();
export { ParseMessageViewer };