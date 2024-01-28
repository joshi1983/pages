const repo = new Map();

class RateLimitedCall {
	constructor(key, call, minTimeMillis) {
		this.key = key;
		this.call = call;
		this.minTimeMillis = minTimeMillis;
		this.resetTimer();
	}

	resetTimer() {
		if (this.timer !== undefined)
			clearTimeout(this.timer);
		const outer = this;
		function callNow() {
			outer.call();
			outer.timer = undefined;
			repo.delete(this.key);
		}
		this.timer = setTimeout(callNow, Math.max(0, this.minTimeMillis));
	}

	setMinTimeMillis(minTimeMillis) {
		this.minTimeMillis = minTimeMillis;
		this.resetTimer();
	}
}

class PrivateRateLimiter {
	run(key, callback, minTimeMillis) {
		if (typeof callback !== 'function')
			throw new Error('callback must be a function');
		if (typeof minTimeMillis !== 'number')
			throw new Error('minTimeMillis must be a number');

		if (!repo.has(key))
			repo.set(key, new RateLimitedCall(key, callback, minTimeMillis));
		else {
			const rateLimitedCall = repo.get(key);
			rateLimitedCall.call = callback;
			rateLimitedCall.setMinTimeMillis(minTimeMillis);
		}
	}
}

const RateLimiter = new PrivateRateLimiter();
export { RateLimiter };