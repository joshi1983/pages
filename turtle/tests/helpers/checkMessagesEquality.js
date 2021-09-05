import { assertEquals } from './assertEquals.js';
import { prefixWrapper } from './prefixWrapper.js';

export function checkMessagesEquality(messages, expectedMessages, logger) {
	if (messages.length !== expectedMessages.length)
		logger(`Expected ${expectedMessages.length} but got ${messages.length}`);
	else {
		for (let i = 0; i < expectedMessages.length; i++) {
			if (expectedMessages[i] !== messages[i]) {
				const plogger = prefixWrapper(`Index ${i}`, logger);
				assertEquals(expectedMessages[i], messages[i], plogger);
				break;
			}
		}
	}
};