import { MessageTypes } from '../../modules/components/MessageTypes.js';
import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';
import { validateParseMessage } from './validateParseMessage.js';

export class TestParseLogger extends ParseLogger {
	constructor(logger, code, ignoreWarnings, isLoggingMessage) {
		if (typeof logger !== 'function')
			throw new Error('logger must be a function');
		if (typeof code !== 'string')
			throw new Error(`code should be specified as a string so the messages are clearer. code=${code}`);
		if (ignoreWarnings === undefined)
			ignoreWarnings = false;
		if (typeof ignoreWarnings !== 'boolean')
			throw new Error('ignoreWarnings must either be undefined or boolean.  Not: ' + ignoreWarnings);
		if (isLoggingMessage !== undefined && typeof isLoggingMessage !== 'function')
			throw new Error(`isLoggingMessage must either be undefined or a function but got type ${typeof isLoggingMessage}`);

		super();
		this.isLoggingErrors = true;
		const outer = this;
		if (typeof isLoggingMessage === 'function')
			this.isLoggingMessage = isLoggingMessage;
		else if (ignoreWarnings)
			this.isLoggingMessage = function(msg, type) {
				return (type !== MessageTypes.TypeWarning) || (outer.isLoggingErrors && type === MessageTypes.TypeError);
			};
		else {
			this.isLoggingMessage = function(msg, type) {
				return (outer.isLoggingErrors && type === MessageTypes.TypeError) || type !== MessageTypes.TypeError;
			};
		}
		this.logger = logger;
		this.code = code;
		this.messages = [];
	}

	doNotLogErrors() {
		this.isLoggingErrors = false;
	}

	error(msg, token, isHTML) {
		if (isHTML !== true)
			isHTML = false;
		super.error(msg, token, isHTML);
		if (this.isLoggingMessage(msg, MessageTypes.TypeError))
			this.logger('ERROR: ' + msg + ', token: ' + token + ', code = ' + this.code);
		this.messages.push({
			'type': MessageTypes.TypeError,
			'msg': msg,
			'isHTML': isHTML
		});
	}

	getErrors() {
		return this.messages.filter((m) => m.type === MessageTypes.TypeError).map((m) => m.msg);
	}

	getTips() {
		return this.messages.filter((m) => m.type === MessageTypes.TypeTip).map((m) => m.msg);
	}

	getWarnings() {
		return this.messages.filter((m) => m.type === MessageTypes.TypeWarning).map((m) => m.msg);
	}

	tip(msg, token, isHTML) {
		if (isHTML !== true)
			isHTML = false;
		super.tip(msg, token, isHTML);
		this.messages.push({
			'type': MessageTypes.TypeTip,
			'msg': msg,
			'isHTML': isHTML
		});
	}

	validateMessages(logger) {
		this.messages.forEach(function(msg) {
			validateParseMessage(msg, logger);
		});
	}

	warn(msg, token) {
		super.warn(msg, token);
		if (this.isLoggingMessage(msg, MessageTypes.TypeWarning))
			this.logger('WARNING: ' + msg + ', token: ' + token + ', code = ' + this.code);
		this.messages.push({
			'type': MessageTypes.TypeWarning,
			'msg': msg
		});
	}
};