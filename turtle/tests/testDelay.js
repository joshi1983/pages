import { delay } from '../modules/delay.js';

export function testDelay(logger) {
	const startTime = new Date().getTime();
	let stopTime;
	delay(100).then(function() {
		stopTime = new Date().getTime();
		if (stopTime - startTime < 100)
			logger('Failed to delay long enough.  The delay was expected to be at least and not much longer than 100ms but got ' + (stopTime - startTime));
	});
	setTimeout(function() {
		if (stopTime === undefined)
			logger('Expected to call "then" not much after 100ms but it was not called even after 500ms.');
	}, 500);
};