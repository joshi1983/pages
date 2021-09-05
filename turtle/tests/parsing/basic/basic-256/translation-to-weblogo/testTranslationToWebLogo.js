import { testExecute } from './testExecute.js';
import { testRemoveCommandsWithoutRequiredParameters } from
'./testRemoveCommandsWithoutRequiredParameters.js';
import { testTranslateFunctionCalls } from './testTranslateFunctionCalls.js';
import { testTranslateRemove } from './testTranslateRemove.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecute,
		testRemoveCommandsWithoutRequiredParameters,
		testTranslateFunctionCalls,
		testTranslateRemove,
		testTranslateVariousExamples
	], logger);
};