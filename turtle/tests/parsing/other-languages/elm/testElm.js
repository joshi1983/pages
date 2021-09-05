import { testIsLikelyElm } from './testIsLikelyElm.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testElm(logger) {
	wrapAndCall([
		testIsLikelyElm
	], logger);
};