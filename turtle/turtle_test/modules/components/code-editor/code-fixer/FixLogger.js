import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';

export class FixLogger {
	constructor(parseLogger) {
		if (!(parseLogger instanceof ParseLogger))
			throw new Error('parseLogger must be a ParseLogger');

		this.parseLogger = parseLogger;
	}

	log(msg, token) {
		this.parseLogger.tip(msg, token, false);
	}
};