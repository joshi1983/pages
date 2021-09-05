import { testExecuteGeneral } from
'./testExecuteGeneral.js';
import { testExecuteOperators } from
'./testExecuteOperators.js';
import { testTranslateVariousExamplesToQBASIC } from
'./testTranslateVariousExamplesToQBASIC.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecuteGeneral,
		testExecuteOperators,
		testTranslateVariousExamplesToQBASIC
	], logger);
};