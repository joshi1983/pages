import { testGetPropertyValues } from
'./testGetPropertyValues.js';
import { testGetReferencedProceduresCode } from
'./testGetReferencedProceduresCode.js';
import { testGetVariableInitializations } from
'./testGetVariableInitializations.js';
import { testSanitization } from
'./sanitization/testSanitization.js';
import { testTranslateVariousExamples } from
'./testTranslateVariousExamples.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testGetPropertyValues,
		testGetReferencedProceduresCode,
		testGetVariableInitializations,
		testSanitization,
		testTranslateVariousExamples,
	], logger);
};