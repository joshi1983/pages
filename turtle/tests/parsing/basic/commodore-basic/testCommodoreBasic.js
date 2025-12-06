/*import { testIsLikelyCommodoreBasic } from
'./testIsLikelyCommodoreBasic.js';
import { testScanning } from
'./scanning/testScanning.js';
*/import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testCommodoreBasic(logger) {
	wrapAndCall([
		/*testIsLikelyCommodoreBasic,
		testScanning,*/
		testTranslationToWebLogo
	], logger);
};