import { testIsLikelyGLSL } from './testIsLikelyGLSL.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testGLSL(logger) {
	wrapAndCall([
		testIsLikelyGLSL
	], logger);
};