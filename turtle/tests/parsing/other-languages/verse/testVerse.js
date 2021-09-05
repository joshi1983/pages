import { testIsLikelyVerse } from './testIsLikelyVerse.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testVerse(logger) {
	wrapAndCall([
		testIsLikelyVerse
	], logger);
};