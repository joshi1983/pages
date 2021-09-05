import { testExecute_PI } from './testExecute_PI.js';
import { testExecuteAssignments } from './testExecuteAssignments.js';
import { testExecuteBinaryOperators } from './testExecuteBinaryOperators.js';
import { testExecuteCINT } from './testExecuteCINT.js';
import { testExecuteCircle } from './testExecuteCircle.js';
import { testExecuteCLNG } from './testExecuteCLNG.js';
import { testExecuteColorFunctions } from './testExecuteColorFunctions.js';
import { testExecuteDef } from './testExecuteDef.js';
import { testExecuteDim } from './testExecuteDim.js';
import { testExecuteDoWhileInstructionsLoop } from './testExecuteDoWhileInstructionsLoop.js';
import { testExecuteDoWhile } from './testExecuteDoWhile.js';
import { testExecuteFIX } from './testExecuteFIX.js';
import { testExecuteIfStatements } from './testExecuteIfStatements.js';
import { testExecuteINT } from './testExecuteINT.js';
import { testExecuteIntegerDivision } from './testExecuteIntegerDivision.js';
import { testExecuteLine } from './testExecuteLine.js';
import { testExecuteLineInput } from './testExecuteLineInput.js';
import { testExecuteMathFunctions } from './testExecuteMathFunctions.js';
import { testExecuteMidStringFunction } from './testExecuteMidStringFunction.js';
import { testExecuteNumberLiterals } from './testExecuteNumberLiterals.js';
import { testExecutePSet } from './testExecutePSet.js';
import { testExecuteRead } from './testExecuteRead.js';
import { testExecuteSharedVariables } from './testExecuteSharedVariables.js';
import { testExecuteSpace$ } from './testExecuteSpace$.js';
import { testExecuteSpecialVariableNames } from './testExecuteSpecialVariableNames.js';
import { testExecuteString$ } from './testExecuteString$.js';
import { testExecuteStringFunctions } from './testExecuteStringFunctions.js';
import { testExecuteStringLiterals } from './testExecuteStringLiterals.js';
import { testExecuteSwap } from './testExecuteSwap.js';
import { testExecuteTrimFunctions } from './testExecuteTrimFunctions.js';
import { testExecuteTrue } from './testExecuteTrue.js';
import { testExecuteWhile } from './testExecuteWhile.js';
import { testGetColorsCode } from './testGetColorsCode.js';
import { testGetReferencedCustomTypes } from './testGetReferencedCustomTypes.js';
import { testGetSingleScreenNumber } from './testGetSingleScreenNumber.js';
import { testInsertSpaces } from './testInsertSpaces.js';
import { testIsArrayOfCustomTypeUsed } from './testIsArrayOfCustomTypeUsed.js';
import { testMightDrawSomething } from './testMightDrawSomething.js';
import { testRefactoring } from './refactoring/testRefactoring.js';
import { testShouldIgnoreScreenCalls } from './testShouldIgnoreScreenCalls.js';
import { testTranslateQBASICToWebLogo } from './testTranslateQBASICToWebLogo.js';
import { testTranslate_PI } from './testTranslate_PI.js';
import { testTranslateAssignments } from './testTranslateAssignments.js';
import { testTranslateBadExamples } from './testTranslateBadExamples.js';
import { testTranslateBinaryOperators } from './testTranslateBinaryOperators.js';
import { testTranslateCommon } from './testTranslateCommon.js';
import { testTranslateContains } from './testTranslateContains.js';
import { testTranslateCos } from './testTranslateCos.js';
import { testTranslateDataSections } from './testTranslateDataSections.js';
import { testTranslateDef } from './testTranslateDef.js';
import { testTranslateDim } from './testTranslateDim.js';
import { testTranslateDoLoop } from './testTranslateDoLoop.js';
import { testTranslateDoLoopUntil } from './testTranslateDoLoopUntil.js';
import { testTranslateDoUntilLoop } from './testTranslateDoUntilLoop.js';
import { testTranslateDoWhile } from './testTranslateDoWhile.js';
import { testTranslateEnd } from './testTranslateEnd.js';
import { testTranslateExit } from './testTranslateExit.js';
import { testTranslateFor } from './testTranslateFor.js';
import { testTranslateFunction } from './testTranslateFunction.js';
import { testTranslateFunctionCall } from './testTranslateFunctionCall.js';
import { testTranslateGoto } from './testTranslateGoto.js';
import { testTranslateIfStatements } from './testTranslateIfStatements.js';
import { testTranslateInput } from './testTranslateInput.js';
import { testTranslateLineInput } from './testTranslateLineInput.js';
import { testTranslateRead } from './testTranslateRead.js';
import { testTranslateSelect } from './testTranslateSelect.js';
import { testTranslateSub } from './testTranslateSub.js';
import { testTranslateSwap } from './testTranslateSwap.js';
import { testTranslateTrueFalse } from './testTranslateTrueFalse.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { testTranslationToWebLogoExecutePrint } from
'./testTranslationToWebLogoExecutePrint.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';
import { testTypeTokenToCreateProcedure } from './testTypeTokenToCreateProcedure.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecute_PI,
		testExecuteAssignments,
		testExecuteBinaryOperators,
		testExecuteCINT,
		testExecuteCircle,
		testExecuteCLNG,
		testExecuteColorFunctions,
		testExecuteDef,
		testExecuteDim,
		testExecuteDoWhileInstructionsLoop,
		testExecuteDoWhile,
		testExecuteFIX,
		testExecuteIfStatements,
		testExecuteINT,
		testExecuteIntegerDivision,
		testExecuteLine,
		testExecuteLineInput,
		testExecuteMathFunctions,
		testExecuteMidStringFunction,
		testExecuteNumberLiterals,
		testExecutePSet,
		testExecuteRead,
		testExecuteSharedVariables,
		testExecuteSpace$,
		testExecuteSpecialVariableNames,
		testExecuteString$,
		testExecuteStringFunctions,
		testExecuteStringLiterals,
		testExecuteSwap,
		testExecuteTrimFunctions,
		testExecuteTrue,
		testExecuteWhile,
		testGetColorsCode,
		testGetReferencedCustomTypes,
		testGetSingleScreenNumber,
		testInsertSpaces,
		testIsArrayOfCustomTypeUsed,
		testMightDrawSomething,
		testRefactoring,
		testShouldIgnoreScreenCalls,
		testTranslateQBASICToWebLogo,
		testTranslate_PI,
		testTranslateAssignments,
		testTranslateBadExamples,
		testTranslateBinaryOperators,
		testTranslateCommon,
		testTranslateContains,
		testTranslateCos,
		testTranslateDataSections,
		testTranslateDef,
		testTranslateDim,
		testTranslateDoLoop,
		testTranslateDoLoopUntil,
		testTranslateDoUntilLoop,
		testTranslateDoWhile,
		testTranslateEnd,
		testTranslateExit,
		testTranslateFor,
		testTranslateFunction,
		testTranslateFunctionCall,
		testTranslateGoto,
		testTranslateIfStatements,
		testTranslateInput,
		testTranslateLineInput,
		testTranslateRead,
		testTranslateSelect,
		testTranslateSub,
		testTranslateSwap,
		testTranslateTrueFalse,
		testTranslateVariousExamples,
		testTranslationToWebLogoExecutePrint,
		testTypeProcessors,
		testTypeTokenToCreateProcedure
	], logger);
};