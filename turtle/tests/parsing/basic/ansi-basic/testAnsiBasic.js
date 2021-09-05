import { testIsLikelyAnsiBasic } from './testIsLikelyAnsiBasic.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testAnsiBasic(logger) {
	wrapAndCall([
		testIsLikelyAnsiBasic
	], logger);
};