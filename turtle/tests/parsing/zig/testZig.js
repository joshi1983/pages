import { testIsLikelyZig } from './testIsLikelyZig.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testZig(logger) {
	wrapAndCall([
		testIsLikelyZig
	], logger);
};