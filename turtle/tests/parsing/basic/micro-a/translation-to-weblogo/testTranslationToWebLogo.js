import { testExecute } from './testExecute.js';
import { testFixFunctionCallsForMicroAInternalFunctions } from
'./testFixFunctionCallsForMicroAInternalFunctions.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecute,
		testFixFunctionCallsForMicroAInternalFunctions,
		testTranslate,
		testTranslateVariousExamples
	], logger);
};