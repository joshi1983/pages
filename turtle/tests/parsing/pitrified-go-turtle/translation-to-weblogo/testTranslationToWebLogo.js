import { testTranslateExecute } from './testTranslateExecute.js';
import { testTranslateExecuteOperators } from './testTranslateExecuteOperators.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateExecute,
		testTranslateExecuteOperators,
		testTranslateVariousExamples
	], logger);
};