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

	warn(msg, token, isHTML) {
		if (isHTML === undefined)
			isHTML = false;
		super.warn(msg, token, isHTML);
		CommandBoxMessages.warn(formatMessage(msg, token), isHTML);
	}
}

const CommandBoxParseLogger = new PrivateCommandBoxParseLogger();

export { CommandBoxParseLogger };