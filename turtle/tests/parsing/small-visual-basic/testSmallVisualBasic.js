import { testIsLikelySmallVisualBasic } from './testIsLikelySmallVisualBasic.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testSmallVisualBasic(logger) {
	wrapAndCall([
		testIsLikelySmallVisualBasic
	], logger);
};