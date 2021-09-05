import { testCallDemoProcedureFixer } from
'./testCallDemoProcedureFixer.js';
import { testTranslateFix } from
'./testTranslateFix.js';
import { testTranslateFunctionCalls } from
'./testTranslateFunctionCalls.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testCallDemoProcedureFixer,
		testTranslateFix,
		testTranslateFunctionCalls,
		testTranslateVariousExamples
	], logger);
};