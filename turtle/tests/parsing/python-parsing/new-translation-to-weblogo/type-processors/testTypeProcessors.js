import { testForLoops } from './for-loops/testForLoops.js';
import { testFunctionCalls } from './function-calls/testFunctionCalls.js';
import { testIf } from './if/testIf.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testForLoops,
		testFunctionCalls,
		testIf
	], logger);
};