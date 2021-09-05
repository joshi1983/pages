import { ParseLogger } from './ParseLogger.js';

export class ConsoleParseLogger extends ParseLogger {
	constructor() {
		super();
	}

	error(msg, token) {
		super.error(msg, token);
		console.error(msg, token);
	}

	tip(msg, token, isHTML) {
		super.tip(msg, token, isHTML);
		console.log(msg, token);
	}

	warn(msg, token) {
		super.warn(msg, token);
		console.warn(msg, token);
	}
};