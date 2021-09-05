import { testGetAllReferencedProcedures } from './testGetAllReferencedProcedures.js';
import { testTranslateFunctionCalls } from './testTranslateFunctionCalls.js';
import { testTranslateVariousExamples } from './testTranslateVariousExamples.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testGetAllReferencedProcedures,
		testTranslateFunctionCalls,
		testTranslateVariousExamples
	], logger);
};