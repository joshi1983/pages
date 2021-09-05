import { testSimplifyForLoopInEnumerate } from
'./testSimplifyForLoopInEnumerate.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeSimplifiers(logger) {
	wrapAndCall([
		testSimplifyForLoopInEnumerate
	], logger);
};