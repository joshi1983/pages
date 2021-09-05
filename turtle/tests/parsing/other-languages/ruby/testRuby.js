import { testIsLikelyRuby } from './testIsLikelyRuby.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testRuby(logger) {
	wrapAndCall([
		testIsLikelyRuby
	], logger);
};