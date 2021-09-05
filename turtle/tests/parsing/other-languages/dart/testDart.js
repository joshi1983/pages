import { testIsLikelyDart } from './testIsLikelyDart.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testDart(logger) {
	wrapAndCall([
		testIsLikelyDart
	], logger);
};