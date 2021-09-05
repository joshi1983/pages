import { testFunctionCalls } from
'./function-calls/testFunctionCalls.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testFunctionCalls
	], logger);
};