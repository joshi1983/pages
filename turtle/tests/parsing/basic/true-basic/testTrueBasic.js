import { testIsLikelyTrueBasic } from
'./testIsLikelyTrueBasic.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTrueBasic(logger) {
	wrapAndCall([
		testIsLikelyTrueBasic
	], logger);
};