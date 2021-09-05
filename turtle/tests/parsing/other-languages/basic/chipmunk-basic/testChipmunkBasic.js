import { testIsLikelyChipmunkBasic } from
'./testIsLikelyChipmunkBasic.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testChipmunkBasic(logger) {
	wrapAndCall([
		testIsLikelyChipmunkBasic
	], logger);
};