import { testAnimationSetupFixer } from './testAnimationSetupFixer.js';
import { testAnimationSnapshotStyleFixer } from './testAnimationSnapshotStyleFixer.js';
import { testAutoRemoveFixer } from './testAutoRemoveFixer.js';
import { testBooleanExpressionAsListFixer } from './testBooleanExpressionAsListFixer.js';
import { testCodeRemoval } from './code-removal/testCodeRemoval.js';
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
import { testForLoopSettingsContainedListFixer } from './testForLoopSettingsContainedListFixer.js';
import { testForLoopVariableFixer } from './testForLoopVariableFixer.js';
import { testGetTokenAfter } from './testGetTokenAfter.js';
import { testGlobalLocalmakeFixer } from './testGlobalLocalmakeFixer.js';
import { testHelpers } from './helpers/testHelpers.js';
import { testIfElseFixer } from './testIfElseFixer.js';
import { testLeafsInDataListsToStringLiteralsFixer } from './testLeafsInDataListsToStringLiteralsFixer.js';
import { testLocalFixer } from './testLocalFixer.js';
import { testMissingSpacesFixer } from './testMissingSpacesFixer.js';
import { testNameCallFixer } from './testNameCallFixer.js';
import { testPcFixer } from './testPcFixer.js';
import { testPenUpPenDownRemoveFixer } from './testPenUpPenDownRemoveFixer.js';
import { testPolishNotationFixer } from './testPolishNotationFixer.js';
import { testPolyEndAfterProcedureFixer } from './testPolyEndAfterProcedureFixer.js';
import { testPolyFixer } from './testPolyFixer.js';
import { testProcedureInProcedureFixer } from './testProcedureInProcedureFixer.js';
import { testQuoteBooleanFixer } from './testQuoteBooleanFixer.js';
import { testQuotedParameterFixer } from './testQuotedParameterFixer.js';
import { testQuoteIntegerFixer } from './testQuoteIntegerFixer.js';
import { testQuoteNumberFixer } from './testQuoteNumberFixer.js';
import { testReadCommandFixer } from './testReadCommandFixer.js';
import { testReplaceSpecialQuoteCharactersWithNormalQuotes } from './testReplaceSpecialQuoteCharactersWithNormalQuotes.js';
import { testRequiredColourNameLongStringFixer } from './testRequiredColourNameLongStringFixer.js';
import { testSetPenSizeFixer } from './testSetPenSizeFixer.js';
import { testSimplifySetHeadingFixer } from './testSimplifySetHeadingFixer.js';
import { testThingCallFixer } from './testThingCallFixer.js';
import { testTransparentCommandFixer } from './testTransparentCommandFixer.js';
import { testUnrecognizedParameterizedGroupNameFixer } from './testUnrecognizedParameterizedGroupNameFixer.js';
import { testUseStrFixer } from './testUseStrFixer.js';
import { testWebTurtleCommandFixer } from './testWebTurtleCommandFixer.js';
import { testWebTurtleProcedureFixer } from './testWebTurtleProcedureFixer.js';
import { testWebTurtleRepeatFixer } from './testWebTurtleRepeatFixer.js';
import { testVariableNameReferenceFixer } from './testVariableNameReferenceFixer.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

const tests = [
	testAnimationSetupFixer,
	testAnimationSnapshotStyleFixer,
	testAutoRemoveFixer,
	testBooleanExpressionAsListFixer,
	testCodeRemoval,
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
	testForLoopSettingsContainedListFixer,
	testForLoopVariableFixer,
	testGetTokenAfter,
	testGlobalLocalmakeFixer,
	testHelpers,
	testIfElseFixer,
	testLeafsInDataListsToStringLiteralsFixer,
	testLocalFixer,
	testMissingSpacesFixer,
	testNameCallFixer,
	testPcFixer,
	testPenUpPenDownRemoveFixer,
	testPolishNotationFixer,
	testPolyEndAfterProcedureFixer,
	testPolyFixer,
	testProcedureInProcedureFixer,
	testQuoteBooleanFixer,
	testQuotedParameterFixer,
	testQuoteIntegerFixer,
	testQuoteNumberFixer,
	testReadCommandFixer,
	testReplaceSpecialQuoteCharactersWithNormalQuotes,
	testRequiredColourNameLongStringFixer,
	testSetPenSizeFixer,
	testSimplifySetHeadingFixer,
	testThingCallFixer,
	testTransparentCommandFixer,
	testUnrecognizedParameterizedGroupNameFixer,
	testUseStrFixer,
	testWebTurtleCommandFixer,
	testWebTurtleProcedureFixer,
	testWebTurtleRepeatFixer,
	testVariableNameReferenceFixer
];

export function testFixers(logger) {
	wrapAndCall(tests, logger);
};