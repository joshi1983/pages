import { testAreAllTrigCallsInDegrees } from
'./testAreAllTrigCallsInDegrees.js';
import { testExecuteGeneral } from
'./testExecuteGeneral.js';
import { testExecuteOperators } from
'./testExecuteOperators.js';
import { testExecuteTrigFunctions } from
'./testExecuteTrigFunctions.js';
import { testReplaceTrigFunctionNames } from
'./testReplaceTrigFunctionNames.js';
import { testTranslateVariousExamplesToQBASIC } from
'./testTranslateVariousExamplesToQBASIC.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testAreAllTrigCallsInDegrees,
		testExecuteGeneral,
		testExecuteOperators,
		testExecuteTrigFunctions,
		testReplaceTrigFunctionNames,
		testTranslateVariousExamplesToQBASIC
	], logger);
};