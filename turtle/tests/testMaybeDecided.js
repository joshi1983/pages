import { MaybeDecided } from '../modules/MaybeDecided.js';

export function testMaybeDecided(logger) {
	if (MaybeDecided.Yes === MaybeDecided.No)
		logger('Yes and No must not equal each other');
	if (MaybeDecided.Maybe === MaybeDecided.No)
		logger('Maybe and No must not equal each other');
	if (MaybeDecided.Maybe === MaybeDecided.Yes)
		logger('Maybe and Yes must not equal each other');
};