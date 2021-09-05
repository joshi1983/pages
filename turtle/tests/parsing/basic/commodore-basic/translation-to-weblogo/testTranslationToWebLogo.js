import { testFixers } from './fixers/testFixers.js';
import { testScanTokenProcessors } from './scantoken-processors/testScanTokenProcessors.js';
import { testTranslateCommodoreBasicToQBasic } from './testTranslateCommodoreBasicToQBasic.js';
import { testTranslateDef } from './testTranslateDef.js';
import { testTranslateLine } from './testTranslateLine.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testFixers,
		testScanTokenProcessors,
		testTranslateCommodoreBasicToQBasic,
		testTranslateDef,
		testTranslateLine
	], logger);
};