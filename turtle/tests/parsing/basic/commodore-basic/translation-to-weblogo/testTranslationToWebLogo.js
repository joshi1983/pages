import { testFixers } from './fixers/testFixers.js';
import { testTranslateCommodoreBasicToQBasic } from './testTranslateCommodoreBasicToQBasic.js';
import { testTranslateDef } from './testTranslateDef.js';
import { testTranslateLine } from './testTranslateLine.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testFixers,
		testTranslateCommodoreBasicToQBasic,
		testTranslateDef,
		testTranslateLine
	], logger);
};