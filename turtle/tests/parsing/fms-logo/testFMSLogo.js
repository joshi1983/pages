import { testFMSCommand } from './testFMSCommand.js';
import { testIsLikelyFMSLogo } from './testIsLikelyFMSLogo.js';
import { testScan } from './testScan.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

export function testFMSLogo(logger) {
	wrapAndCall([
		testFMSCommand,
		testIsLikelyFMSLogo,
		testScan,
		testTranslationToWebLogo
	], logger);
};