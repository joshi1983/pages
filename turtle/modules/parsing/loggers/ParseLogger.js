export class ParseLogger {
	constructor() {
		this.errorCount = 0;
		this.tipCount = 0;
		this.warningCount = 0;
		this.tippedTokens = new Set();
	}

	error(msg, token) {
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