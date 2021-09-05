import { testTranslateBadExamples } from
'./testTranslateBadExamples.js';
import { testTranslateFunctions } from
'./testTranslateFunctions.js';
import { testTranslatePrints } from
'./testTranslatePrints.js';
import { testTranslateProcedures } from
'./testTranslateProcedures.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testTranslateBadExamples,
		testTranslateFunctions,
		testTranslatePrints,
		testTranslateProcedures
	], logger);
};