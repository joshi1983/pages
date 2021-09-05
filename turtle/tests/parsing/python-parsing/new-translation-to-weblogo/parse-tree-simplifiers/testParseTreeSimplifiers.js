import { testRenameCustomFunctionsToAvoidWebLogoCommands } from
'./testRenameCustomFunctionsToAvoidWebLogoCommands.js';
import { testSimplifyForLoopInEnumerate } from
'./testSimplifyForLoopInEnumerate.js';
import { testSimplifyForLoopInEnumerateToRange } from
'./testSimplifyForLoopInEnumerateToRange.js';
import { testSimplifyLen } from
'./testSimplifyLen.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParseTreeSimplifiers(logger) {
	wrapAndCall([
		testRenameCustomFunctionsToAvoidWebLogoCommands,
		testSimplifyForLoopInEnumerate,
		testSimplifyForLoopInEnumerateToRange,
		testSimplifyLen
	], logger);
};