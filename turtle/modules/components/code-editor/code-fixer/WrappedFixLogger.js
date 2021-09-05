import { FixLogger } from './FixLogger.js';

export class WrappedFixLogger extends FixLogger {
	constructor(fixLogger) {
		super(fixLogger.parseLogger);
		this.innerFixLogger = fixLogger;
		this._logCalled = false;
	}

	hasLoggedAnything() {
		return this._logCalled;
	}

	log() {
		this._logCalled = true;
		this.innerFixLogger.log(...arguments);
	}
};