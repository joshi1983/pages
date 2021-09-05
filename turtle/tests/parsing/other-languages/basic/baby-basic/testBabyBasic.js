import { testIsLikelyBabyBasic } from './testIsLikelyBabyBasic.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testBabyBasic(logger) {
	wrapAndCall([
		testIsLikelyBabyBasic
	], logger);
};