import { testSimplifyBreaks } from './testSimplifyBreaks.js';
import { testSimplifyConditions } from './testSimplifyConditions.js';
import { testSimplifyForLoops } from './testSimplifyForLoops.js';
import { testSimplifyReturns } from './testSimplifyReturns.js';
import { testSimplifySwitches } from './testSimplifySwitches.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testSimplifying(logger) {
	wrapAndCall([
		testSimplifyBreaks,
		testSimplifyConditions,
		testSimplifyForLoops,
		testSimplifyReturns,
		testSimplifySwitches
	], logger);
};