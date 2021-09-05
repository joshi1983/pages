import { testShouldBeWrappedInPoly } from
'./testShouldBeWrappedInPoly.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testFunctionCalls(logger) {
	wrapAndCall([
		testShouldBeWrappedInPoly
	], logger);
};