import { testHelpers } from
'./helpers/testHelpers.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testHelpers
	], logger);
};