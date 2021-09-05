import { testAnimationSetupFixer } from './testAnimationSetupFixer.js';
import { testAnimationSnapshotStyleFixer } from './testAnimationSnapshotStyleFixer.js';
import { testArrayLiteralFixer } from './testArrayLiteralFixer.js';
import { testAskFixer } from './testAskFixer.js';
import { testAutoRemoveFixer } from './testAutoRemoveFixer.js';
import { testBooleanExpressionAsListFixer } from './testBooleanExpressionAsListFixer.js';
import { testCanvas2D } from './canvas-2d/testCanvas2D.js';
import { testCatchFixer } from './testCatchFixer.js';
import { testClashingProcedureNameFixer } from './testClashingProcedureNameFixer.js';
import { testCodeHeartTurtleScript } from './codeheart-turtlescript/testCodeHeartTurtleScript.js';
import { testCodeRemoval } from './code-removal/testCodeRemoval.js';
import { testColorCallWithDataListFixer } from './testColorCallWithDataListFixer.js';
import { testColourStringLiteralFixer } from './testColourStringLiteralFixer.js';
import { testCommaFixer } from './testCommaFixer.js';
import { testCommandTranslationFixer } from './testCommandTranslationFixer.js';
import { testConvertToJumpCommandFixer } from './testConvertToJumpCommandFixer.js';
import { testCurvedBracketFixer } from './testCurvedBracketFixer.js';
import { testDefineFixer } from './testDefineFixer.js';
import { testDoTimesFixer } from './testDoTimesFixer.js';
import { testEndIfFixer } from './testEndIfFixer.js';
import { testErroneousSpacesFixer } from './testErroneousSpacesFixer.js';
import { testFilledFixer } from './testFilledFixer.js';
import { testForeachFixer } from './testForeachFixer.js';
import { testForLoopSettingsContainedListFixer } from './testForLoopSettingsContainedListFixer.js';
import { testForLoopVariableFixer } from './testForLoopVariableFixer.js';
import { testGetTokenAfter } from './testGetTokenAfter.js';
import { testGlobalLocalmakeFixer } from './testGlobalLocalmakeFixer.js';
import { testHatSymbolPowerFixer } from './testHatSymbolPowerFixer.js';
import { testHelpers } from './helpers/testHelpers.js';
import { testIfElseFixer } from './testIfElseFixer.js';
import { testInstructionListSquareBracketsRemoveFixer } from './testInstructionListSquareBracketsRemoveFixer.js';
import { testJumpFixer } from './testJumpFixer.js';
import { testLeafsInDataListsToStringLiteralsFixer } from './testLeafsInDataListsToStringLiteralsFixer.js';
import { testLocalFixer } from './testLocalFixer.js';
import { testLogo3D } from './logo-3d/testLogo3D.js';
import { testMakeAssignFixer } from './testMakeAssignFixer.js';
import { testMinusSignSpaceInsertFixer } from './testMinusSignSpaceInsertFixer.js';
import { testMissingSpacesFixer } from './testMissingSpacesFixer.js';
import { testNameCallFixer } from './testNameCallFixer.js';
import { testPapert } from './papert/testPapert.js';
import { testPcFixer } from './testPcFixer.js';
import { testPenUpPenDownRemoveFixer } from './testPenUpPenDownRemoveFixer.js';
import { testPenWidthCallWithValueFixer } from './testPenWidthCallWithValueFixer.js';
import { testPolishNotationFixer } from './testPolishNotationFixer.js';
import { testPolyEndAfterProcedureFixer } from './testPolyEndAfterProcedureFixer.js';
import { testPolyFixer } from './testPolyFixer.js';
import { testProcedureInProcedureFixer } from './testProcedureInProcedureFixer.js';
import { testProcedureNameTypeFixer } from './testProcedureNameTypeFixer.js';
import { testQuoteBooleanFixer } from './testQuoteBooleanFixer.js';
import { testQuotedParameterFixer } from './testQuotedParameterFixer.js';
import { testQuoteIntegerFixer } from './testQuoteIntegerFixer.js';
import { testQuoteNumberFixer } from './testQuoteNumberFixer.js';
import { testReadCommandFixer } from './testReadCommandFixer.js';
import { testRemoveUnstartedPolyEnd } from './testRemoveUnstartedPolyEnd.js';
import { testRemoveUnusedAssignments } from './testRemoveUnusedAssignments.js';
import { testReplaceSpecialQuoteCharactersWithNormalQuotes } from './testReplaceSpecialQuoteCharactersWithNormalQuotes.js';
import { testRequiredColourNameLongStringFixer } from './testRequiredColourNameLongStringFixer.js';
import { testRunFixer } from './testRunFixer.js';
import { testSetPenSizeFixer } from './testSetPenSizeFixer.js';
import { testSimplifySetHeadingFixer } from './testSimplifySetHeadingFixer.js';
import { testStopRemoveFixer } from './testStopRemoveFixer.js';
import { testTerrapin } from './terrapin/testTerrapin.js';
import { testTestFixer } from './testTestFixer.js';
import { testThingCallFixer } from './testThingCallFixer.js';
import { testThrowFixer } from './testThrowFixer.js';
import { testTildeFixer } from './testTildeFixer.js';
import { testTransparentCommandFixer } from './testTransparentCommandFixer.js';
import { testUnrecognizedParameterizedGroupNameFixer } from './testUnrecognizedParameterizedGroupNameFixer.js';
import { testUseStrFixer } from './testUseStrFixer.js';
import { testWebTurtleCommandFixer } from './testWebTurtleCommandFixer.js';
import { testWebTurtleProcedureFixer } from './testWebTurtleProcedureFixer.js';
import { testWebTurtleRepeatFixer } from './testWebTurtleRepeatFixer.js';
import { testVariableNameReferenceFixer } from './testVariableNameReferenceFixer.js';
import { testVariableReadSpaceInsertFixer } from './testVariableReadSpaceInsertFixer.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

const tests = [
	testAnimationSetupFixer,
	testAnimationSnapshotStyleFixer,
	testArrayLiteralFixer,
	testAskFixer,
	testAutoRemoveFixer,
	testBooleanExpressionAsListFixer,
	testCanvas2D,
	testCatchFixer,
	testClashingProcedureNameFixer,
	testCodeHeartTurtleScript,
	testCodeRemoval,
	testColorCallWithDataListFixer,
	testColourStringLiteralFixer,
	testCommaFixer,
	testCommandTranslationFixer,
	testConvertToJumpCommandFixer,
	testCurvedBracketFixer,
	testDefineFixer,
	testDoTimesFixer,
	testEndIfFixer,
	testErroneousSpacesFixer,
	testFilledFixer,
	testForeachFixer,
	testForLoopSettingsContainedListFixer,
	testForLoopVariableFixer,
	testGetTokenAfter,
	testGlobalLocalmakeFixer,
	testHatSymbolPowerFixer,
	testHelpers,
	testIfElseFixer,
	testInstructionListSquareBracketsRemoveFixer,
	testJumpFixer,
	testLeafsInDataListsToStringLiteralsFixer,
	testLocalFixer,
	testLogo3D,
	testMakeAssignFixer,
	testMinusSignSpaceInsertFixer,
	testMissingSpacesFixer,
	testNameCallFixer,
	testPapert,
	testPcFixer,
	testPenUpPenDownRemoveFixer,
	testPenWidthCallWithValueFixer,
	testPolishNotationFixer,
	testPolyEndAfterProcedureFixer,
	testPolyFixer,
	testProcedureInProcedureFixer,
	testProcedureNameTypeFixer,
	testQuoteBooleanFixer,
	testQuotedParameterFixer,
	testQuoteIntegerFixer,
	testQuoteNumberFixer,
	testReadCommandFixer,
	testRemoveUnstartedPolyEnd,
	testRemoveUnusedAssignments,
	testReplaceSpecialQuoteCharactersWithNormalQuotes,
	testRequiredColourNameLongStringFixer,
	testRunFixer,
	testSetPenSizeFixer,
	testSimplifySetHeadingFixer,
	testStopRemoveFixer,
	testTerrapin,
	testTestFixer,
	testThingCallFixer,
	testThrowFixer,
	testTildeFixer,
	testTransparentCommandFixer,
	testUnrecognizedParameterizedGroupNameFixer,
	testUseStrFixer,
	testWebTurtleCommandFixer,
	testWebTurtleProcedureFixer,
	testWebTurtleRepeatFixer,
	testVariableNameReferenceFixer,
	testVariableReadSpaceInsertFixer
];

export function testFixers(logger) {
	wrapAndCall(tests, logger);
};