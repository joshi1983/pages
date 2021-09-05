import { testIsLikelyCobol } from './testIsLikelyCobol.js';
import { testNaiveStripCobolComments } from './testNaiveStripCobolComments.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCobol(logger) {
	wrapAndCall([
		testIsLikelyCobol,
		testNaiveStripCobolComments
	], logger);
};