import { testForeachExecution } from './testForeachExecution.js';
import { testPrintExecution } from './testPrintExecution.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateExamples } from
'./testTranslateExamples.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testForeachExecution,
		testPrintExecution,
		testTranslate,
		testTranslateExamples
	], logger);
};