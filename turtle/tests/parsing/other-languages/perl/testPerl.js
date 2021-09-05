import { testIsLikelyPerl } from './testIsLikelyPerl.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testPerl(logger) {
	wrapAndCall([
		testIsLikelyPerl
	], logger);
};