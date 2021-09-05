import { testFixers } from './fixers/testFixers.js';
import { testTranslateCircle } from './testTranslateCircle.js';
import { testTranslateCommodoreBasicToQBasic } from './testTranslateCommodoreBasicToQBasic.js';
import { testTranslateDef } from './testTranslateDef.js';
import { testTranslateLine } from './testTranslateLine.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testFixers,
		testTranslateCircle,
		testTranslateCommodoreBasicToQBasic,
		testTranslateDef,
		testTranslateLine
	], logger);
};