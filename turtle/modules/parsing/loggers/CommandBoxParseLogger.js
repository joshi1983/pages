import { CommandBoxMessages } from '../../components/CommandBoxMessages.js';
import { ParseLogger } from './ParseLogger.js';

function formatMessage(msg, token) {
	if (token.lineIndex > 0)
		msg = "Line " + token.lineIndex + ": " + msg;
	return msg;
}

class PrivateCommandBoxParseLogger extends ParseLogger {
	error(msg, token, isHTML) {
		if (isHTML === undefined)
			isHTML = false;
		super.error(msg, token, isHTML);
		CommandBoxMessages.error(formatMessage(msg, token), isHTML);
	}

	tip(msg, token, isHTML) {
		super.tip(msg, token, isHTML);
		CommandBoxMessages.tip(formatMessage(msg, token), isHTML);
	}

	warn(msg, token) {
		super.warn(msg, token);
		CommandBoxMessages.warn(formatMessage(msg, token), false);
	}
}

const CommandBoxParseLogger = new PrivateCommandBoxParseLogger();

export { CommandBoxParseLogger };