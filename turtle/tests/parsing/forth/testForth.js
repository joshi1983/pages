import { testIsLikelyForth } from './testIsLikelyForth.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testForth(logger) {
	wrapAndCall([
		testIsLikelyForth
	], logger);
};