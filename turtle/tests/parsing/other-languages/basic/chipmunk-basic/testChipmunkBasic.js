import { testIsLikelyChipmunkBasic } from
'./testIsLikelyChipmunkBasic.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testChipmunkBasic(logger) {
	return wrapAndCall([
		testIsLikelyChipmunkBasic
	], logger);
};