import { testIsLikelyGleam } from './testIsLikelyGleam.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testGleam(logger) {
	wrapAndCall([
		testIsLikelyGleam
	], logger);
};