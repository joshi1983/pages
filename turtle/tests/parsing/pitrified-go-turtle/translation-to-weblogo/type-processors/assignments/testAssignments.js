import { testGetMakeCommandFor } from
'./testGetMakeCommandFor.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testAssignments(logger) {
	wrapAndCall([
		testGetMakeCommandFor
	], logger);
};