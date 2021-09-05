import { testIsLikelyApex } from
'./testIsLikelyApex.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testApex(logger) {
	wrapAndCall([
		testIsLikelyApex
	], logger);
};