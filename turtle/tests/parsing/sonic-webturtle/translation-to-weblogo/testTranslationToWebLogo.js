import { testPredefinedProcedureCodeQuality } from './testPredefinedProcedureCodeQuality.js';
import { testTranslate } from './testTranslate.js';
import { testTranslateAllExamples } from './testTranslateAllExamples.js';
import { testTranslateProcedures } from './testTranslateProcedures.js';
import { testTranslateWithProcedures } from './testTranslateWithProcedures.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testPredefinedProcedureCodeQuality,
		testTranslate,
		testTranslateAllExamples,
		testTranslateProcedures,
		testTranslateWithProcedures
	], logger);
};