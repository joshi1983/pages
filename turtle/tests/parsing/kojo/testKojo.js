/*import { testColorsJSON } from './testColorsJSON.js';
import { testEvaluation } from './evaluation/testEvaluation.js';
import { testIsLikelyKojo } from './testIsLikelyKojo.js';
import { testMigrationJson } from './testMigrationJson.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParsing } from './parsing/testParsing.js';
import { testScanning } from './scanning/testScanning.js';*/
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testKojo(logger) {
	wrapAndCall([
		/*testColorsJSON,
		testEvaluation,
		testIsLikelyKojo,
		testMigrationJson,
		testOperatorsJSON,
		testParsing,
		testScanning,*/
		testTranslationToWebLogo
	], logger);
};