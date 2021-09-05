import { testIsLikelyLua } from './testIsLikelyLua.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testLua(logger) {
	wrapAndCall([
		testIsLikelyLua,
	], logger);
};