import { testIsLikelyLibertyBasic } from
'./testIsLikelyLibertyBasic.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testLibertyBasic(logger) {
	wrapAndCall([
		testIsLikelyLibertyBasic
	], logger);
};