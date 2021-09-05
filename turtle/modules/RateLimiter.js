const repo = new Map();

class RateLimitedCall {
	constructor(key, call, minTimeMillis, invokeEagerly) {
		this.key = key;
		this.call = call;
		this.minTimeMillis = minTimeMillis;
		this.lastCallTime = Date.now();
		this.invokeEagerly = invokeEagerly;
		this.resetTimer();
	}

	resetTimer() {
		if (this.timer !== undefined)
			clearTimeout(this.timer);
		const outer = this;
		function callNow() {
			outer.call();
			outer.lastCallTime = Date.now();
			outer.timer = undefined;
			repo.delete(outer.key);
		}
		if (this.invokeEagerly &&
		Date.now() - outer.lastCallTime > this.minTimeMillis) {
			callNow();
		}
		this.timer = setTimeout(callNow, Math.max(0, this.minTimeMillis));
	}

	setMinTimeMillis(minTimeMillis) {
		this.minTimeMillis = minTimeMillis;
		this.resetTimer();
	}
}

class PrivateRateLimiter {
	run(key, callback, minTimeMillis, invokeEagerly) {
		if (typeof callback !== 'function')
			throw new Error('callback must be a function');
		if (typeof minTimeMillis !== 'number')
			throw new Error('minTimeMillis must be a number');
		if (invokeEagerly === undefined)
			invokeEagerly = false;
		else if (typeof invokeEagerly !== 'boolean')
			throw new Error(`invokeEagerly should either be undefined or boolean but found ${invokeEagerly}`);

		if (!repo.has(key))
			repo.set(key, new RateLimitedCall(key, callback, minTimeMillis, invokeEagerly));
		else {
			const rateLimitedCall = repo.get(key);
			rateLimitedCall.call = callback;
			rateLimitedCall.setMinTimeMillis(minTimeMillis);
		}
	}
}

const RateLimiter = new PrivateRateLimiter();
export { RateLimiter };