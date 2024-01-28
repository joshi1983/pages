export class ParseLogger {
	constructor() {
		this.errorCount = 0;
		this.tipCount = 0;
		this.warningCount = 0;
		this.tippedTokens = new Set();
	}

	error(msg, token, isHTML) {
		if (typeof token !== 'object') {
			console.error('token: ', token);
			throw new Error('error requires a token object');
		}
		this.errorCount++;
	}

	hasLoggedErrors() {
		return this.errorCount > 0;
	}

	hasLoggedErrorsOrWarnings() {
		return (this.errorCount + this.warningCount) !== 0;
	}

	hasLoggedTips() {
		return this.tipCount !== 0;
	}

	hasLoggedWarnings() {
		return this.warningCount > 0;
	}

	hasReachedErrorLimit() {
		return this.hasLoggedErrors();
	}

	hasTippedForToken(token) {
		return this.tippedTokens.has(token);
	}

	logAll(parseMessages) {
		if (!(parseMessages instanceof Array))
			throw new Error(`parseMessages must be an Array.  Not: ${parseMessages}`);
		if (parseMessages.length > 0 && typeof parseMessages[0].sendTo !== 'function')
			throw new Error(`Expected sendTo to be a function but got ${parseMessages[0].sendTo}`);
		parseMessages.forEach(parseMessage => parseMessage.sendTo(this));
	}

	reset() {
		this.resetErrorCounter();
		this.tipCount = 0;
		this.warningCount = 0;
	}

	resetErrorCounter() {
		this.errorCount = 0;
	}

	tip(msg, token, isHTML) {
		if (typeof token !== 'object')
			throw new Error('tip requires a token object');
		if (isHTML === undefined)
			isHTML = false;
		else if (typeof isHTML !== 'boolean')
			throw new Error('isHTML must either be unspecified/undefined or a boolean value.  Not: ' + isHTML);
		this.tipCount++;
		this.tippedTokens.add(token);
	}

	warn(msg, token) {
		if (typeof token !== 'object')
			throw new Error('warn requires a token object');
		this.warningCount++;
	}
};