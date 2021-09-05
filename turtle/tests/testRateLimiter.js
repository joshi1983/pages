import { RateLimiter } from '../modules/RateLimiter.js';

export function testRateLimiter(logger) {
	var called = false;
	function func1() {
		logger('Called func1 unexpectedly.  It should not be called because the function should have been replaced.');
	}
	function func2() {
		called = true;
	}
	RateLimiter.run('f', func1, 100);
	setTimeout(function() {
		RateLimiter.run('f', func2, 100);
	}, 50);
	setTimeout(function() {
		if (called === false)
			logger('Expected to call func2 after 150ms total but it did not happen after 1s');
	}, 1000);

};