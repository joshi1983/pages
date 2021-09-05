import { testColourIndexEvaluator } from
'./testColourIndexEvaluator.js';
import { testTranslateSeaTurtleToWebLogo } from
'./testTranslateSeaTurtleToWebLogo.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testColourIndexEvaluator,
		testTranslateSeaTurtleToWebLogo
	], logger);
};