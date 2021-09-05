import { testIsLikelyHPGL } from
'./testIsLikelyHPGL.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testHPGL(logger) {
	wrapAndCall([
		testIsLikelyHPGL
	], logger);
};