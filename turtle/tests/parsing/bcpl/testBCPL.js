import { testIsLikelyBCPL } from './testIsLikelyBCPL.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testBCPL(logger) {
	wrapAndCall([
		testIsLikelyBCPL
	], logger);
};