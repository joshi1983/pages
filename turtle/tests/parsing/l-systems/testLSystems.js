import { test0L } from
'./0L/test0L.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testLSystems(logger) {
	wrapAndCall([
		test0L
	], logger);
};