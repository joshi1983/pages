import { testIsLikelyVintageBasic } from
'./testIsLikelyVintageBasic.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testVintageBasic(logger) {
	wrapAndCall([
		testIsLikelyVintageBasic
	], logger);
};