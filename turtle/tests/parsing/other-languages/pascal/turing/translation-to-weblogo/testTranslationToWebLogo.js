import { testExecuteFor } from
'./testExecuteFor.js';
import { testExecuteFunctionCalls } from
'./testExecuteFunctionCalls.js';
import { testExecuteLoop } from
'./testExecuteLoop.js';
import { testExecuteOperators } from
'./testExecuteOperators.js';
import { testExecuteWithArrays } from
'./testExecuteWithArrays.js';
import { testTranslateArrayAssignments } from
'./testTranslateArrayAssignments.js';
import { testTranslateAssert } from
'./testTranslateAssert.js';
import { testTranslateBadExamples } from
'./testTranslateBadExamples.js';
import { testTranslateFunctionCalls } from
'./testTranslateFunctionCalls.js';
import { testTranslateFunctions } from
'./testTranslateFunctions.js';
import { testTranslateIf } from
'./testTranslateIf.js';
import { testTranslateLoop } from
'./testTranslateLoop.js';
import { testTranslateModule } from
'./testTranslateModule.js';
import { testTranslatePrints } from
'./testTranslatePrints.js';
import { testTranslateProcedures } from
'./testTranslateProcedures.js';
import { testTranslateVar } from
'./testTranslateVar.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecuteFor,
		testExecuteFunctionCalls,
		testExecuteLoop,
		testExecuteOperators,
		testExecuteWithArrays,
		testTranslateArrayAssignments,
		testTranslateAssert,
		testTranslateBadExamples,
		testTranslateFunctionCalls,
		testTranslateFunctions,
		testTranslateIf,
		testTranslateLoop,
		testTranslateModule,
		testTranslatePrints,
		testTranslateProcedures,
		testTranslateVar
	], logger);
};