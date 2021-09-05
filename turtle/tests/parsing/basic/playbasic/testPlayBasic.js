import { testIsLikelyPlayBasic } from './testIsLikelyPlayBasic.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPlayBasic(logger) {
	wrapAndCall([
		testIsLikelyPlayBasic,
	], logger);
};