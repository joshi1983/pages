import { testConvertWalrusOperatorToAssignment } from
'./testConvertWalrusOperatorToAssignment.js';
import { testHelpers } from
'./helpers/testHelpers.js';
import { testRemoveImportAliases } from
'./testRemoveImportAliases.js';
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
import { testSimplifyParseTree } from
'./testSimplifyParseTree.js';
import { testSpreadPackageNamesToImportedIdentifiers } from
'./testSpreadPackageNamesToImportedIdentifiers.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testParseTreeSimplifiers(logger) {
	wrapAndCall([
		testConvertWalrusOperatorToAssignment,
		testHelpers,
		testRemoveImportAliases,
		testRemoveUnstartedEndFillCalls,
		testRenameCustomFunctionsToAvoidWebLogoCommands,
		testSimplifyForLoopInEnumerate,
		testSimplifyForLoopInEnumerateToRange,
		testSimplifyLen,
		testSimplifyParseTree,
		testSpreadPackageNamesToImportedIdentifiers
	], logger);
};