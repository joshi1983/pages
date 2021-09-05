import { testScanTokenProcessors } from './scantoken-processors/testScanTokenProcessors.js';
import { testTranslateCommodoreBasicToQBasic } from './testTranslateCommodoreBasicToQBasic.js';
import { testTranslateLine } from './testTranslateLine.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testScanTokenProcessors,
		testTranslateCommodoreBasicToQBasic,
		testTranslateLine
	], logger);
};