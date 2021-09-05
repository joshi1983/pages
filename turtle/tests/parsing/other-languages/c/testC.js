import { testIsLikelyC } from './testIsLikelyC.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testC(logger) {
	wrapAndCall([
		testIsLikelyC
	], logger);
};