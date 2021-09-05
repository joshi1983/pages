import { testIsLikelyBasilBasic } from './testIsLikelyBasilBasic.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testBasil(logger) {
	wrapAndCall([
		testIsLikelyBasilBasic
	], logger);
};