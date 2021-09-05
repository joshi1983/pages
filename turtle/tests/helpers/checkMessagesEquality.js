
export function checkMessagesEquality(messages, expectedMessages, logger) {
	if (messages.length !== expectedMessages.length)
		logger(`Expected ${expectedMessages.length} but got ${messages.length}`);
	else {
		for (let i = 0; i < expectedMessages.length; i++) {
			if (expectedMessages[i] !== messages[i]) {
				logger(`Index ${i}, expected ${expectedMessages[i]} but got ${messages[i]}`);
				break;
			}
		}
	}
};