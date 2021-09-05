import { testExecuteBinaryOperators } from './testExecuteBinaryOperators.js';
import { testExecuteCircle } from './testExecuteCircle.js';
import { testExecuteColorFunctions } from './testExecuteColorFunctions.js';
import { testExecuteDim } from './testExecuteDim.js';
import { testExecuteDoWhile } from './testExecuteDoWhile.js';
import { testExecuteIfStatements } from './testExecuteIfStatements.js';
import { testExecuteLine } from './testExecuteLine.js';
import { testExecuteLineInput } from './testExecuteLineInput.js';
import { testExecutePSet } from './testExecutePSet.js';
import { testExecuteRead } from './testExecuteRead.js';
import { testExecuteSpace$ } from './testExecuteSpace$.js';
import { testExecuteStringFunctions } from './testExecuteStringFunctions.js';
import { testExecuteSwap } from './testExecuteSwap.js';
import { testExecuteWhile } from './testExecuteWhile.js';
import { testGetColorsCode } from './testGetColorsCode.js';
import { testGetReferencedCustomTypes } from './testGetReferencedCustomTypes.js';
import { testGetSingleScreenNumber } from './testGetSingleScreenNumber.js';
import { testIsArrayOfCustomTypeUsed } from './testIsArrayOfCustomTypeUsed.js';
import { testMightDrawSomething } from './testMightDrawSomething.js';
import { testShouldIgnoreScreenCalls } from './testShouldIgnoreScreenCalls.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateBadExamples } from './testTranslateBadExamples.js';
import { testTranslateContains } from './testTranslateContains.js';
import { testTranslateDataSections } from './testTranslateDataSections.js';
import { testTranslateDef } from './testTranslateDef.js';
import { testTranslateDim } from './testTranslateDim.js';
import { testTranslateDoLoop } from './testTranslateDoLoop.js';
import { testTranslateDoUntil } from './testTranslateDoUntil.js';
import { testTranslateDoUntilLoop } from './testTranslateDoUntilLoop.js';
import { testTranslateDoWhile } from './testTranslateDoWhile.js';
import { testTranslateFor } from './testTranslateFor.js';
import { testTranslateFunction } from './testTranslateFunction.js';
import { testTranslateGoto } from './testTranslateGoto.js';
import { testTranslateIfStatements } from './testTranslateIfStatements.js';
import { testTranslateInput } from './testTranslateInput.js';
import { testTranslateLineInput } from './testTranslateLineInput.js';
import { testTranslateRead } from './testTranslateRead.js';
import { testTranslateSelect } from './testTranslateSelect.js';
import { testTranslateSub } from './testTranslateSub.js';
import { testTranslateSwap } from './testTranslateSwap.js';
import { testTranslationToWebLogoExecutePrint } from
'./testTranslationToWebLogoExecutePrint.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';
import { testTypeTokenToCreateProcedure } from './testTypeTokenToCreateProcedure.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
			testExecuteBinaryOperators,
			testExecuteCircle,
			testExecuteColorFunctions,
			testExecuteDim,
			testExecuteDoWhile,
			testExecuteIfStatements,
			testExecuteLine,
			testExecuteLineInput,
			testExecutePSet,
			testExecuteRead,
			testExecuteSpace$,
			testExecuteStringFunctions,
			testExecuteSwap,
			testExecuteWhile,
			testGetColorsCode,
			testGetReferencedCustomTypes,
			testGetSingleScreenNumber,
			testIsArrayOfCustomTypeUsed,
			testMightDrawSomething,
			testShouldIgnoreScreenCalls,
			testTranslate,
			testTranslateBadExamples,
			testTranslateContains,
			testTranslateDataSections,
			testTranslateDef,
			testTranslateDim,
			testTranslateDoLoop,
			testTranslateDoUntil,
			testTranslateDoUntilLoop,
			testTranslateDoWhile,
			testTranslateFor,
			testTranslateFunction,
			testTranslateGoto,
			testTranslateIfStatements,
			testTranslateInput,
			testTranslateLineInput,
			testTranslateRead,
			testTranslateSelect,
			testTranslateSub,
			testTranslateSwap,
			testTranslationToWebLogoExecutePrint,
			testTypeProcessors,
			testTypeTokenToCreateProcedure,
		], logger);
};