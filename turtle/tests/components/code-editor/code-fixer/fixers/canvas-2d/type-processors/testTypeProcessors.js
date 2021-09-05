import { testAssignments } from
'./assignments/testAssignments.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testAssignments
	], logger);
};