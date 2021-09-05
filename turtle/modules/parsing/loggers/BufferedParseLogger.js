import { MessageTypes } from '../../components/MessageTypes.js';
import { ParseLogger } from './ParseLogger.js';
import { ParseMessage } from './ParseMessage.js';

export class BufferedParseLogger extends ParseLogger {
	constructor() {
		super();
		this._messages = [];
	}

	error(msg, token) {
		super.error(msg, token);
		this._messages.push(new ParseMessage(MessageTypes.TypeError, msg, token, false));
	}

	getMessages() {
		return this._messages;
	}

	reset() {
		super.reset();
		this._messages = [];
	}

	sendAllMessagesTo(parseLogger) {
		this._messages.forEach(m => m.sendTo(parseLogger));
	}

	tip(msg, token, isHTML) {
		super.tip(msg, token, isHTML);
		this._messages.push(new ParseMessage(MessageTypes.TypeTip, msg, token, isHTML));
	}

	warn(msg, token) {
		super.warn(msg, token);
		this._messages.push(new ParseMessage(MessageTypes.TypeWarning, msg, token, false));
	}
};