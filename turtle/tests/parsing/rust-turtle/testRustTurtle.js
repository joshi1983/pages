import { testIsLikelyRustTurtle } from
'./testIsLikelyRustTurtle.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testRustTurtle(logger) {
	wrapAndCall([
		testIsLikelyRustTurtle
	], logger);
};