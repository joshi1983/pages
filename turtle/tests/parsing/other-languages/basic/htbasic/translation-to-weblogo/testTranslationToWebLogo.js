import { testExecute } from
'./testExecute.js';
import { testTranslateRemove } from
'./testTranslateRemove.js';
import { testTranslateVariousExamples } from
'./testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecute,
		testTranslateRemove,
		testTranslateVariousExamples
	], logger);
};