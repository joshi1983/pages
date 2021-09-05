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
import { testTranslateBadTektronixCode } from
'./testTranslateBadTektronixCode.js';
import { testTranslateVariousExamplesToQBASIC } from
'./testTranslateVariousExamplesToQBASIC.js';
import { testTranslateVariousFunctions } from
'./testTranslateVariousFunctions.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testAreAllTrigCallsInDegrees,
		testExecuteGeneral,
		testExecuteOperators,
		testExecuteTrigFunctions,
		testReplaceTrigFunctionNames,
		testTranslateBadTektronixCode,
		testTranslateVariousExamplesToQBASIC,
		testTranslateVariousFunctions
	], logger);
};