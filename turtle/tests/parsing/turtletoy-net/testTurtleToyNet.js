import { testIsLikelyTurtleToyNet } from
'./testIsLikelyTurtleToyNet.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testTurtleToyNet(logger) {
	wrapAndCall([
		testIsLikelyTurtleToyNet,
		testTranslationToWebLogo
	], logger);
};