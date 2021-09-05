import { MessageTypes } from '../../components/MessageTypes.js';
import { ParseLogger } from './ParseLogger.js';
import { ParseMessage } from './ParseMessage.js';

export class BufferedParseLogger extends ParseLogger {
	constructor() {
		super();
		this._messages = [];
	}

	error(msg, token, isHTML) {
		if (isHTML === undefined)
			isHTML = false;

		super.error(msg, token, isHTML);
		this._messages.push(new ParseMessage(MessageTypes.TypeError, msg, token, isHTML));
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

	warn(msg, token, isHTML) {
		if (isHTML === undefined)
			isHTML = false;
		super.warn(msg, token, isHTML);
		this._messages.push(new ParseMessage(MessageTypes.TypeWarning, msg, token, isHTML));
	}
};