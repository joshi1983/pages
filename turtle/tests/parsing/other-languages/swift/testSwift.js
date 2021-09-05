import { testIsLikelySwift } from './testIsLikelySwift.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testSwift(logger) {
	wrapAndCall([
		testIsLikelySwift
	], logger);
};