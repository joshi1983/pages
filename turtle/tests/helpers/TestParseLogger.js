import { ParseLogger } from '../../modules/parsing/loggers/ParseLogger.js';

/* Similar purpose but not the same values as the constants defined in CommandBoxMessages */
const TypeWarning = 0;
const TypeError = 1;
const TypeTip = 2;

export class TestParseLogger extends ParseLogger {
	constructor(logger, code, ignoreWarnings) {
		if (typeof logger !== 'function')
			throw new Error('logger must be a function');
		if (code === undefined)
			throw new Error('code should be specified so the messages are clearer');
		if (ignoreWarnings === undefined)
			ignoreWarnings = false;
		if (typeof ignoreWarnings !== 'boolean')
			throw new Error('ignoreWarnings must either be undefined or boolean.  Not: ' + ignoreWarnings);

		super();
		this.isLoggingErrors = true;
		this.ignoreWarnings = ignoreWarnings;
		this.logger = logger;
		this.code = code;
		this.messages = [];
	}

	doNotLogErrors() {
		this.isLoggingErrors = false;
	}

	error(msg, token) {
		super.error(msg, token);
		if (this.isLoggingErrors)
			this.logger('ERROR: ' + msg + ', token: ' + token + ', code = ' + this.code);
		this.messages.push({
			'type': TypeError,
			'msg': msg
		});
	}

	getErrors() {
		return this.messages.filter((m) => m.type === TypeError).map((m) => m.msg);
	}

	getTips() {
		return this.messages.filter((m) => m.type === TypeTip).map((m) => m.msg);
	}

	getWarnings() {
		return this.messages.filter((m) => m.type === TypeWarning).map((m) => m.msg);
	}

	tip(msg, token, isHTML) {
		super.tip(msg, token, isHTML);
		this.messages.push({
			'type': TypeTip,
			'msg': msg
		});
	}

	warn(msg, token) {
		if (this.ignoreWarnings)
			return;
		super.warn(msg, token);
		this.logger('WARNING: ' + msg + ', token: ' + token + ', code = ' + this.code);
		this.messages.push({
			'type': TypeWarning,
			'msg': msg
		});
	}
};