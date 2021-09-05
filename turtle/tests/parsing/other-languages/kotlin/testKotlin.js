import { testIsLikelyKotlin } from './testIsLikelyKotlin.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testKotlin(logger) {
	wrapAndCall([
		testIsLikelyKotlin
	], logger);
};