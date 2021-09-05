import { testGermanLogoToWebLogoSpecificOutputs } from './testGermanLogoToWebLogoSpecificOutputs.js';
import { testGermanLogoToWebLogoWithVariousExamples } from './testGermanLogoToWebLogoWithVariousExamples.js';
import { testIsLikelyGermanLogo } from './testIsLikelyGermanLogo.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testGermanLogo(logger) {
	wrapAndCall([
		testGermanLogoToWebLogoSpecificOutputs,
		testGermanLogoToWebLogoWithVariousExamples,
		testIsLikelyGermanLogo
	], logger);
};