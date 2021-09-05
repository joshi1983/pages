export function addMessage(messageContainer, messageCount, messageToDiv) {
	return function(message) {
		const div = messageToDiv(message.msg);
		messageContainer.appendChild(div);
		messageCount.increment();
	};
};