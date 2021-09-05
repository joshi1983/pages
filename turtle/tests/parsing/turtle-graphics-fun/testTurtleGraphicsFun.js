import { testIsLikelyTurtleGraphicsFun } from
'./testIsLikelyTurtleGraphicsFun.js';
import { testMigrationToProc } from
'./testMigrationToProc.js';
import { testTranslationToWebLogo } from
'./translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testTurtleGraphicsFun(logger) {
	wrapAndCall([
		testIsLikelyTurtleGraphicsFun,
		testMigrationToProc,
		testTranslationToWebLogo
	], logger);
};