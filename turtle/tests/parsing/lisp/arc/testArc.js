import { testIsLikelyArc } from './testIsLikelyArc.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testArc(logger) {
	wrapAndCall([
		testIsLikelyArc
	], logger);
};