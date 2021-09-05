export function addMessage(messageContainer, messageCount, messageToDiv) {
	return function(message, type, isHTML, buttonConfig) {
		if (typeof message !== 'object') 
			throw new Error(`message should be an object but found ${message}`);
		if (message.msg === undefined && typeof message.details === 'object')
			message = message.details;
		if (typeof message.msg !== 'string')
			throw new Error(`message.msg should be a string but found ${message.msg}`);
		const div = messageToDiv(message.msg, type, isHTML);
		if (typeof buttonConfig === 'object') {
			const button = document.createElement('button');
			button.innerText = buttonConfig.name;
			button.addEventListener('click', buttonConfig.onclick);
			div.appendChild(button);
		}
		messageContainer.appendChild(div);
		messageCount.increment();
	};
};