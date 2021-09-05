import { testIsLikelyWGSL } from './testIsLikelyWGSL.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testWGSL(logger) {
	wrapAndCall([
		testIsLikelyWGSL
	], logger);
};