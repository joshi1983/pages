/*import { testEvaluation } from './evaluation/testEvaluation.js';
import { testIsLikelyPitrifiedGoTurtle } from './testIsLikelyPitrifiedGoTurtle.js';
import { testMigrationJSON } from './testMigrationJSON.js';
import { testMigrationInfo } from './testMigrationInfo.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
*/import { testParsing } from './parsing/testParsing.js';
/*import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
*/import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testPitrifiedGoTurtle(logger) {
	wrapAndCall([
		/*testEvaluation,
		testIsLikelyPitrifiedGoTurtle,
		testMigrationJSON,
		testMigrationInfo,
		testOperatorsJSON,*/
		testParsing,
		/*testScanning,
		testTranslationToWebLogo*/
	], logger);
};