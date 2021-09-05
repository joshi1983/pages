import { testAssignments } from
'./assignments/testAssignments.js';
import { testForLoops } from './for-loops/testForLoops.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testAssignments,
		testForLoops
	], logger);
};