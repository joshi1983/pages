import { testIsLikelyHaskell } from './testIsLikelyHaskell.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testHaskell(logger) {
	wrapAndCall([
		testIsLikelyHaskell
	], logger);
};