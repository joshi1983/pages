import { testIsLikelyModula2 } from './testIsLikelyModula2.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testModula2(logger) {
	wrapAndCall([
		testIsLikelyModula2
	], logger);
};