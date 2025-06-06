import { ProgressIndicator } from './helpers/ProgressIndicator.js';
import { RateLimiter } from '../modules/RateLimiter.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';

function testGeneralCase(logger) {
	var called = false;
	const indicator = new ProgressIndicator('testRateLimiter:testGeneralCase');
	logger.indicators.push(indicator);
	function func1() {
		logger('Called func1 unexpectedly.  It should not be called because the function should have been replaced.');
	}
	function func2() {
		called = true;
		indicator.setProgressRatio(1);
		indicator.completed();
	}
	const maxTimeout = 30000;
	RateLimiter.run('f', func1, 100);
	indicator.setProgressRatio(0.1);
	setTimeout(function() {
		indicator.setProgressRatio(0.2);
		RateLimiter.run('f', func2, 100);
	}, 50);
	setTimeout(function() {
		if (called === false) {
			logger(`Expected to call func2 after 150ms total but it did not happen after ${maxTimeout}ms`);
			indicator.completed();
		}
	}, maxTimeout);
}

function testEagerInvoking(logger) {
	var called = false;
	const indicator = new ProgressIndicator('testRateLimiter:testEagerInvoking');
	logger.indicators.push(indicator);
	function func1() {
		logger('Called func1 unexpectedly.  It should not be called because the function should have been replaced.');
	}
	function func2() {
		called = true;
		logger('Called func2 unexpectedly.  It should not be called because the function should have been replaced.');
	}
	function func3() {
		
		indicator.setProgressRatio(1);
		indicator.completed();
	}
	const maxTimeout = 30000;
	RateLimiter.run('f', func1, 100, true);
	indicator.setProgressRatio(0.1);
	setTimeout(function() {
		indicator.setProgressRatio(0.2);
		RateLimiter.run('f', func2, 100);
	}, 50);
	setTimeout(function() {
		indicator.setProgressRatio(0.3);
		RateLimiter.run('f', func3, 100);
	}, 90);
	setTimeout(function() {
		if (called === false) {
			logger(`Expected to call func2 after 100ms total but it did not happen after ${maxTimeout}ms`);
			indicator.completed();
		}
	}, maxTimeout);
}

export function testRateLimiter(logger) {
	wrapAndCall([
		testGeneralCase,
		testEagerInvoking
	], logger);
};