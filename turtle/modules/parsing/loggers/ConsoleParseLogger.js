import { ParseLogger } from './ParseLogger.js';

export class ConsoleParseLogger extends ParseLogger {
	constructor() {
		super();
	}

	error(msg, token, isHTML) {
		if (isHTML === undefined)
			isHTML = false;
		super.error(msg, token, isHTML);
		console.error(msg, token);
	}

	tip(msg, token, isHTML) {
		super.tip(msg, token, isHTML);
		console.log(msg, token);
	}

	warn(msg, token, isHTML) {
		super.warn(msg, token, isHTML);
		console.warn(msg, token);
	}
};