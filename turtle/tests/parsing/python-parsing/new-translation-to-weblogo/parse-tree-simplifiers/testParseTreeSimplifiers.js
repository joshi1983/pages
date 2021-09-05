import { testConvertWalrusOperatorToAssignment } from
'./testConvertWalrusOperatorToAssignment.js';
import { testHelpers } from
'./helpers/testHelpers.js';
import { testRemoveUnstartedEndFillCalls } from
'./testRemoveUnstartedEndFillCalls.js';
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
		testConvertWalrusOperatorToAssignment,
		testHelpers,
		testRemoveUnstartedEndFillCalls,
		testRenameCustomFunctionsToAvoidWebLogoCommands,
		testSimplifyForLoopInEnumerate,
		testSimplifyForLoopInEnumerateToRange,
		testSimplifyLen
	], logger);
};