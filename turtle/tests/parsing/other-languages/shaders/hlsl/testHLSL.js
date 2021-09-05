import { testIsLikelyHLSL } from './testIsLikelyHLSL.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testHLSL(logger) {
	wrapAndCall([
		testIsLikelyHLSL
	], logger);
};