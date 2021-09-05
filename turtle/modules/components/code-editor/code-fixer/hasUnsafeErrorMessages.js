import { MessageTypes } from '../../MessageTypes.js';

export function hasUnsafeErrorMessages(parseLogger) {
	if (!parseLogger.hasLoggedErrors())
		return false;

	const messages = parseLogger.getMessages().filter(m => m.type === MessageTypes.TypeError);
	return messages.some(m => !m.msg.startsWith('All procedure arguments must start with \':\' instead of "'));
};