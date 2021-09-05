import { testIsLikelyHolyC } from './testIsLikelyHolyC.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testHolyC(logger) {
	wrapAndCall([
		testIsLikelyHolyC
	], logger);
};